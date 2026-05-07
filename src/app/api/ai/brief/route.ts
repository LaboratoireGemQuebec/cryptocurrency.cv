/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 *
 * /api/ai/brief - cache-backed read.
 *
 * Refactor 2026-05-07: reads `ai_brief_cache` written by the
 * news-aggregator Worker. Returns either the full DailyBrief or the compact
 * summary view depending on `?format=`.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { aiBriefCache } from '@/lib/db/schema';
import { readNeonCache, fireAndForgetRefresh } from '@/lib/cache-read';
import { staleCache, generateCacheKey } from '@/lib/cache';
import { generateDailyBrief, isAIConfigured, type BriefFormat } from '@/lib/ai-brief';

export const runtime = 'edge';

const CACHE_KEY = 'ai-brief:default';
const STALE_AFTER_MS = 30 * 60_000;

interface AiBriefPayload {
  date: string;
  full: unknown;
  summary: { executiveSummary: string; topStories: unknown[]; generatedAt: string };
  generatedAt: string;
}

export async function GET(request: NextRequest) {
  const sp = new URL(request.url).searchParams;
  const date = sp.get('date') || undefined;
  const format = (sp.get('format') || 'full') as BriefFormat;

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
  }
  if (!['full', 'summary'].includes(format)) {
    return NextResponse.json({ error: 'Invalid format. Use "full" or "summary"' }, { status: 400 });
  }

  const staleKey = generateCacheKey('ai-brief', { date: date ?? 'today', format });

  // Path 1: Neon cache (only serves the default 'today' brief; explicit date
  // requests fall through to direct fetch).
  if (!date) {
    const cached = await readNeonCache<AiBriefPayload>(aiBriefCache, CACHE_KEY);
    if (cached) {
      const stale = cached.ageMs > STALE_AFTER_MS;
      if (stale) fireAndForgetRefresh('ai-brief');
      const brief = format === 'summary' ? cached.payload.summary : cached.payload.full;
      const responseData = {
        success: true,
        brief,
        _cache: { source: 'neon', ageMs: cached.ageMs, stale },
      };
      staleCache.set(staleKey, responseData, 3600);
      return NextResponse.json(responseData, {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
          'Access-Control-Allow-Origin': '*',
          'X-Cache': stale ? 'STALE-NEON' : 'HIT-NEON',
          'X-Cache-Age-Ms': String(cached.ageMs),
        },
      });
    }

    const inMem = staleCache.get<Record<string, unknown>>(staleKey);
    if (inMem) {
      fireAndForgetRefresh('ai-brief');
      return NextResponse.json(
        { ...inMem, _stale: true, _cache: { source: 'memory-stale' } },
        { headers: { 'X-Cache': 'STALE-MEMORY', 'Access-Control-Allow-Origin': '*' } },
      );
    }
  }

  // Path 3: direct fetch.
  if (!isAIConfigured()) {
    return NextResponse.json(
      { error: 'AI not configured', message: 'No AI provider API key found.' },
      { status: 503 },
    );
  }

  fireAndForgetRefresh('ai-brief');
  try {
    const brief = await generateDailyBrief(date, format);
    const responseData = { success: true, brief, _cache: { source: 'direct' } };
    if (!date) staleCache.set(staleKey, responseData, 3600);
    return NextResponse.json(responseData, {
      headers: { 'X-Cache': 'MISS-DIRECT', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to generate brief',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
