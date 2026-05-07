/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 *
 * /api/fear-greed - cache-backed read.
 *
 * Refactor 2026-05-07: reads `fear_greed_cache` populated by the
 * news-aggregator Worker every hour. Slices `historical` to ?days=.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { fearGreedCache } from '@/lib/db/schema';
import { readNeonCache, fireAndForgetRefresh } from '@/lib/cache-read';
import { staleCache, generateCacheKey } from '@/lib/cache';
import { instrumented } from '@/lib/telemetry-middleware';

const CACHE_KEY = 'fear-greed:default';
const STALE_AFTER_MS = 60 * 60_000;

interface FearGreedDataPoint {
  value: number;
  valueClassification: string;
  timestamp: number;
  timeUntilUpdate: string;
}

interface FearGreedPayload {
  current: FearGreedDataPoint;
  historical: FearGreedDataPoint[];
  trend: {
    direction: 'improving' | 'worsening' | 'stable';
    change7d: number;
    change30d: number;
    averageValue7d: number;
    averageValue30d: number;
  };
  lastUpdated: string;
}

export const GET = instrumented(
  async function GET(request: NextRequest) {
    const sp = new URL(request.url).searchParams;
    const daysRaw = parseInt(sp.get('days') || '30', 10);
    const days = Number.isFinite(daysRaw) ? Math.max(1, Math.min(daysRaw, 365)) : 30;
    const staleKey = generateCacheKey('fear-greed', { days });

    const cached = await readNeonCache<FearGreedPayload>(fearGreedCache, CACHE_KEY);
    if (cached) {
      const stale = cached.ageMs > STALE_AFTER_MS;
      if (stale) fireAndForgetRefresh('fear-greed');
      const responseData = {
        current: cached.payload.current,
        historical: cached.payload.historical.slice(0, days),
        trend: cached.payload.trend,
        lastUpdated: cached.payload.lastUpdated,
        _cache: { source: 'neon', ageMs: cached.ageMs, stale },
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

    const inMem = staleCache.get<Record<string, unknown>>(staleKey);
    if (inMem) {
      fireAndForgetRefresh('fear-greed');
      return NextResponse.json(
        { ...inMem, _stale: true, _cache: { source: 'memory-stale' } },
        { headers: { 'X-Cache': 'STALE-MEMORY' } },
      );
    }

    // Path 3: try alternative.me directly (5s timeout).
    fireAndForgetRefresh('fear-greed');
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 5000);
      try {
        const [curR, hisR] = await Promise.all([
          fetch('https://api.alternative.me/fng/', { signal: ctrl.signal }),
          fetch(`https://api.alternative.me/fng/?limit=${Math.min(days, 365)}`, { signal: ctrl.signal }),
        ]);
        if (!curR.ok || !hisR.ok) throw new Error(`alternative.me HTTP ${curR.status}/${hisR.status}`);
        const cur = await curR.json();
        const his = await hisR.json();
        return NextResponse.json(
          { current: cur.data?.[0] ?? null, historical: his.data ?? [], trend: null, lastUpdated: new Date().toISOString(), _cache: { source: 'direct' } },
          { headers: { 'X-Cache': 'MISS-DIRECT' } },
        );
      } finally {
        clearTimeout(t);
      }
    } catch (e) {
      return NextResponse.json(
        { error: 'Failed to fetch Fear & Greed', message: e instanceof Error ? e.message : String(e) },
        { status: 500 },
      );
    }
  },
  { name: 'fear-greed' },
);
