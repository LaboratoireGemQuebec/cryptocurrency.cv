/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 *
 * /api/ai/digest
 *
 * Refactor 2026-05-07 (CF Workers cutover - Q1):
 *
 *   - Default request (no `?topic=` and no `?coins=`): serves a JSON payload
 *     from `ai_digest_cache` (written by the news-aggregator Worker every
 *     15 min). cv_news_skill/cv_client.py uses sync HTTP and consumes JSON.
 *
 *   - `?topic=...` or `?coins=...`: bypasses the cache and streams SSE
 *     directly from the upstream Groq Llama call (preserves the original
 *     real-time UX for browser clients).
 */

import { type NextRequest, NextResponse } from 'next/server';
import { aiDigestCache } from '@/lib/db/schema';
import { readNeonCache, fireAndForgetRefresh } from '@/lib/cache-read';
import { staleCache, generateCacheKey } from '@/lib/cache';
import { getLatestNews } from '@/lib/crypto-news';
import { aiCompleteStream, getAIConfigOrNull } from '@/lib/ai-provider';

export const runtime = 'edge';

const CACHE_KEY = 'ai-digest:default';
const STALE_AFTER_MS = 15 * 60_000;

interface AiDigestPayload {
  topic: string;
  text: string;
  articleCount: number;
  generatedAt: string;
}

const SYSTEM_PROMPT = `You are a senior crypto analyst writing a real-time intelligence digest.

Given a curated set of recent news headlines + descriptions, write a flowing, insightful narrative analysis.

Follow this structure (use markdown headers):
## Key Developments
2-4 of the most significant stories, with brief context.

## What It Means
1-2 paragraphs interpreting the signal vs. noise.

## Market Implications
Concrete takeaways for investors or builders.

## Watch
1-3 things to monitor in the next 24-48 hours.

Keep the total response under 400 words. Be direct, confident, and specific.
Do NOT include disclaimers.`;

export async function GET(request: NextRequest) {
  const sp = new URL(request.url).searchParams;
  const topic = sp.get('topic')?.trim() || '';
  const coinsParam = sp.get('coins') || '';
  const limit = Math.min(parseInt(sp.get('limit') || '60', 10), 100);

  // ─── Cached JSON path (default topic, no per-request streaming) ────────
  if (!topic && !coinsParam) {
    const staleKey = generateCacheKey('ai-digest', { topic: 'default' });
    const cached = await readNeonCache<AiDigestPayload>(aiDigestCache, CACHE_KEY);
    if (cached) {
      const stale = cached.ageMs > STALE_AFTER_MS;
      if (stale) fireAndForgetRefresh('ai-digest');
      const responseData = { ...cached.payload, _cache: { source: 'neon', ageMs: cached.ageMs, stale } };
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
    const inMem = staleCache.get<Record<string, unknown>>(staleKey);
    if (inMem) {
      fireAndForgetRefresh('ai-digest');
      return NextResponse.json(
        { ...inMem, _stale: true, _cache: { source: 'memory-stale' } },
        { headers: { 'X-Cache': 'STALE-MEMORY', 'Access-Control-Allow-Origin': '*' } },
      );
    }
    // Continue to streaming path with default topic on cold start.
  }

  // ─── Streaming SSE path (topic-specific or cold-start) ─────────────────
  const cfg = getAIConfigOrNull(true);
  if (!cfg) {
    return Response.json(
      { error: 'No AI provider configured. Set GROQ_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY.' },
      { status: 503 },
    );
  }

  const newsData = await getLatestNews(limit);
  const coins = coinsParam
    ? coinsParam
        .toUpperCase()
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
    : [];
  const keywords: string[] = [];
  if (topic) keywords.push(...topic.toLowerCase().split(/\s+/).filter((w) => w.length > 2));
  keywords.push(...coins.map((c) => c.toLowerCase()));

  const relevant =
    keywords.length > 0
      ? newsData.articles.filter((a) => {
          const hay = `${a.title} ${a.description ?? ''} ${a.category ?? ''}`.toLowerCase();
          return keywords.some((kw) => hay.includes(kw));
        })
      : newsData.articles;
  const articles = relevant.length >= 5 ? relevant : newsData.articles.slice(0, 30);
  const topN = articles.slice(0, 40);

  const articleList = topN
    .map(
      (a, i) =>
        `[${i + 1}] ${a.source} | ${new Date(a.pubDate).toLocaleDateString()} | ${a.title}${
          a.description ? ' - ' + a.description.slice(0, 120) : ''
        }`,
    )
    .join('\n');

  const topicLabel = topic ? `"${topic}"` : coins.length > 0 ? `coins: ${coins.join(', ')}` : '"crypto market overview"';
  const userPrompt = `Write a crypto intelligence digest focused on ${topicLabel}.

Here are ${topN.length} recent news articles ordered by relevance:

${articleList}

Write the digest now.`;

  const stream = aiCompleteStream(SYSTEM_PROMPT, userPrompt, { maxTokens: 1024, temperature: 0.45 }, true);

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = stream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(encoder.encode(value));
        }
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
      'X-Cache': 'MISS-DIRECT',
      Connection: 'keep-alive',
    },
  });
}
