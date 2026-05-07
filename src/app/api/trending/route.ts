/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 *
 * /api/trending - cache-backed read.
 *
 * Refactor 2026-05-07: reads `trending_cache` populated by the news-aggregator
 * Worker every minute. Slices to ?limit=, hours filtering trusts the upstream
 * payload (default 24h window).
 */

import { type NextRequest, NextResponse } from 'next/server';
import { trendingCache } from '@/lib/db/schema';
import { readNeonCache, fireAndForgetRefresh } from '@/lib/cache-read';
import { staleCache, generateCacheKey } from '@/lib/cache';
import { instrumented } from '@/lib/telemetry-middleware';
import { ApiError } from '@/lib/api-error';
import { createRequestLogger } from '@/lib/logger';

export const runtime = 'edge';
export const revalidate = 60;

const CACHE_KEY = 'trending:default';
const STALE_AFTER_MS = 5 * 60_000;

interface TrendingTopic {
  topic: string;
  count: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  recentHeadlines: string[];
}

interface TrendingPayload {
  trending: TrendingTopic[];
  timeWindow: string;
  articlesAnalyzed: number;
  fetchedAt: string;
}

export const GET = instrumented(
  async function GET(request: NextRequest) {
    const logger = createRequestLogger(request);
    const startTime = Date.now();
    const sp = request.nextUrl.searchParams;
    const limitRaw = parseInt(sp.get('limit') || '10', 10);
    const limit = Math.min(Number.isNaN(limitRaw) ? 10 : Math.max(1, limitRaw), 20);
    const staleKey = generateCacheKey('trending', { limit });

    try {
      // Path 1: Neon cache.
      const cached = await readNeonCache<TrendingPayload>(trendingCache, CACHE_KEY);
      if (cached) {
        const stale = cached.ageMs > STALE_AFTER_MS;
        if (stale) fireAndForgetRefresh('trending');
        const sliced = cached.payload.trending.slice(0, limit);
        const responseData = {
          trending: sliced,
          timeWindow: cached.payload.timeWindow,
          articlesAnalyzed: cached.payload.articlesAnalyzed,
          fetchedAt: cached.payload.fetchedAt,
          _cache: { source: 'neon', ageMs: cached.ageMs, stale },
          _timing: { durationMs: Date.now() - startTime },
        };
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
        fireAndForgetRefresh('trending');
        return NextResponse.json(
          { ...inMem, _stale: true, _cache: { source: 'memory-stale' } },
          { headers: { 'X-Cache': 'STALE-MEMORY', 'Access-Control-Allow-Origin': '*' } },
        );
      }

      // Path 3: empty placeholder while Worker warms up.
      fireAndForgetRefresh('trending');
      logger.warn('trending cache cold, returning empty payload');
      return NextResponse.json(
        {
          trending: [],
          timeWindow: '24h',
          articlesAnalyzed: 0,
          fetchedAt: new Date().toISOString(),
          _cache: { source: 'empty' },
          _timing: { durationMs: Date.now() - startTime },
        },
        { headers: { 'X-Cache': 'MISS-DIRECT', 'Access-Control-Allow-Origin': '*' } },
      );
    } catch (error) {
      logger.error('Failed to get trending topics', error);
      const stale = staleCache.get<Record<string, unknown>>(staleKey);
      if (stale) {
        return NextResponse.json(
          { ...stale, _stale: true, _cache: { source: 'error-fallback' } },
          { headers: { 'X-Cache': 'STALE-ERROR-FALLBACK', 'Access-Control-Allow-Origin': '*' } },
        );
      }
      return ApiError.internal('Failed to get trending topics', error);
    }
  },
  { name: 'trending' },
);
