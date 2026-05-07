/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * /api/clickbait - cache-backed read.
 *
 * Refactor 2026-05-07 (CF Workers): the heavy Groq Llama analysis is now done
 * once per minute by the news-aggregator Worker; this route only reads
 * `clickbait_cache` and applies request-time threshold filtering.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { clickbaitCache } from '@/lib/db/schema';
import { readNeonCache, fireAndForgetRefresh } from '@/lib/cache-read';
import { staleCache, generateCacheKey } from '@/lib/cache';
import { getLatestNews } from '@/lib/crypto-news';
import { promptAIJson, isAIConfigured, AIAuthError } from '@/lib/ai-provider';
import { aiNotConfiguredResponse, aiAuthErrorResponse } from '@/app/api/_utils';

export const runtime = 'edge';
export const revalidate = 60;

const CACHE_KEY = 'clickbait:default';
const STALE_AFTER_MS = 10 * 60_000;

interface ClickbaitAnalysis {
  title: string;
  link: string;
  source: string;
  clickbaitScore: number;
  clickbaitReasons: string[];
  rewrittenTitle: string;
  emotionalTone: 'fear' | 'greed' | 'excitement' | 'neutral' | 'urgency';
  accuracy: 'likely_accurate' | 'possibly_exaggerated' | 'needs_verification';
}

interface ClickbaitPayload {
  analysis: ClickbaitAnalysis[];
  stats: {
    total: number;
    averageScore: number;
    highClickbait: number;
    lowClickbait: number;
    healthyRatio: number;
  };
  analyzedAt: string;
}

const SYSTEM_PROMPT = `You are a media literacy expert analyzing cryptocurrency news headlines for clickbait and sensationalism.

For each headline, evaluate:
1. clickbaitScore: 0-100 (0 = factual, 100 = pure clickbait)
2. clickbaitReasons: Why it might be clickbait
3. rewrittenTitle: A more accurate, neutral version
4. emotionalTone: fear|greed|excitement|neutral|urgency
5. accuracy: likely_accurate|possibly_exaggerated|needs_verification

Respond with JSON: { "analysis": [...] }`;

function buildResponse(payload: ClickbaitPayload, threshold: number, limit: number) {
  let analysis = payload.analysis;
  if (threshold > 0) analysis = analysis.filter((a) => a.clickbaitScore >= threshold);
  if (limit > 0) analysis = analysis.slice(0, limit);
  const total = analysis.length;
  const sumScore = analysis.reduce((s, a) => s + a.clickbaitScore, 0);
  const high = analysis.filter((a) => a.clickbaitScore >= 70).length;
  const low = analysis.filter((a) => a.clickbaitScore <= 30).length;
  return {
    analysis,
    stats: {
      total,
      averageScore: total > 0 ? Math.round(sumScore / total) : 0,
      highClickbait: high,
      lowClickbait: low,
      healthyRatio: total > 0 ? Math.round((low / total) * 100) : 100,
    },
    analyzedAt: payload.analyzedAt,
  };
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const limitRaw = parseInt(sp.get('limit') || '10', 10);
  const thresholdRaw = parseInt(sp.get('threshold') || '0', 10);
  const limit = Math.min(Number.isNaN(limitRaw) ? 10 : Math.max(1, limitRaw), 30);
  const threshold = Number.isNaN(thresholdRaw) ? 0 : Math.max(0, Math.min(thresholdRaw, 100));
  const staleKey = generateCacheKey('clickbait', { limit, threshold });

  // Path 1: Neon cache.
  const cached = await readNeonCache<ClickbaitPayload>(clickbaitCache, CACHE_KEY);
  if (cached) {
    const stale = cached.ageMs > STALE_AFTER_MS;
    if (stale) fireAndForgetRefresh('clickbait');
    const data = buildResponse(cached.payload, threshold, limit);
    const responseData = { ...data, _cache: { source: 'neon', ageMs: cached.ageMs, stale } };
    staleCache.set(staleKey, responseData, 3600);
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': stale ? 'STALE-NEON' : 'HIT-NEON',
        'X-Cache-Age-Ms': String(cached.ageMs),
      },
    });
  }

  // Path 2: in-memory stale.
  const inMem = staleCache.get<Record<string, unknown>>(staleKey);
  if (inMem) {
    fireAndForgetRefresh('clickbait');
    return NextResponse.json(
      { ...inMem, _stale: true, _cache: { source: 'memory-stale' } },
      { headers: { 'X-Cache': 'STALE-MEMORY', 'Access-Control-Allow-Origin': '*' } },
    );
  }

  // Path 3: direct fetch fallback (preserves cold-start behaviour).
  if (!isAIConfigured()) return aiNotConfiguredResponse();
  fireAndForgetRefresh('clickbait');

  try {
    const data = await getLatestNews(limit);
    if (data.articles.length === 0) {
      return NextResponse.json({ analysis: [], message: 'No articles to analyze' });
    }
    const headlines = data.articles.map((a) => ({ title: a.title, link: a.link, source: a.source }));
    const userPrompt = `Analyze these ${headlines.length} crypto news headlines for clickbait:

${JSON.stringify(headlines, null, 2)}`;
    const result = await promptAIJson<{ analysis: ClickbaitAnalysis[] }>(SYSTEM_PROMPT, userPrompt, {
      maxTokens: 3000,
      temperature: 0.3,
    });

    const payload: ClickbaitPayload = {
      analysis: result.analysis ?? [],
      stats: { total: 0, averageScore: 0, highClickbait: 0, lowClickbait: 0, healthyRatio: 100 },
      analyzedAt: new Date().toISOString(),
    };
    const responseData = { ...buildResponse(payload, threshold, limit), _cache: { source: 'direct' } };
    staleCache.set(staleKey, responseData, 3600);
    return NextResponse.json(responseData, {
      headers: { 'X-Cache': 'MISS-DIRECT', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    if (error instanceof AIAuthError) return aiAuthErrorResponse((error as Error).message);
    const stale = staleCache.get<Record<string, unknown>>(staleKey);
    if (stale) {
      return NextResponse.json(
        { ...stale, _stale: true, _cache: { source: 'error-fallback' } },
        { headers: { 'X-Cache': 'STALE-ERROR-FALLBACK', 'Access-Control-Allow-Origin': '*' } },
      );
    }
    return NextResponse.json(
      { error: 'Failed to analyze headlines' },
      { status: 500, headers: { 'X-Cache': 'MISS' } },
    );
  }
}
