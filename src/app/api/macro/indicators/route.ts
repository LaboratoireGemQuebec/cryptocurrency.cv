/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 *
 * /api/macro/indicators - cache-backed read.
 *
 * Refactor 2026-05-07: reads `macro_indicators_cache` populated by the
 * news-aggregator Worker (FRED + Alpha Vantage + Twelve Data). Filters by
 * ?indicators=DXY,VIX,SPX at request time.
 */

import { NextResponse } from 'next/server';
import { macroIndicatorsCache } from '@/lib/db/schema';
import { readNeonCache, fireAndForgetRefresh } from '@/lib/cache-read';
import { staleCache, generateCacheKey } from '@/lib/cache';
import { macroChain } from '@/lib/providers/adapters/macro';
import type { MacroIndicator } from '@/lib/providers/adapters/macro/types';

export const revalidate = 600;

const CACHE_KEY = 'macro:default';
const STALE_AFTER_MS = 10 * 60_000;

interface MacroPayload {
  data: (MacroIndicator & { symbol?: string })[];
  count: number;
  period: string;
  fetchedAt: string;
}

export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const filterStr = sp.get('indicators');
  const period = sp.get('period') || '1d';
  const staleKey = generateCacheKey('macro', { filter: filterStr ?? 'all', period });

  function applyFilter(payload: MacroPayload) {
    let indicators = payload.data ?? [];
    if (filterStr) {
      const requested = filterStr.split(',').map((s) => s.trim().toUpperCase());
      indicators = indicators.filter((ind) => {
        const sym = ((ind as { symbol?: string }).symbol ?? ind.name ?? '').toUpperCase();
        return requested.some((r) => sym.includes(r));
      });
    }
    return { data: indicators, count: indicators.length, period };
  }

  const cached = await readNeonCache<MacroPayload>(macroIndicatorsCache, CACHE_KEY);
  if (cached) {
    const stale = cached.ageMs > STALE_AFTER_MS;
    if (stale) fireAndForgetRefresh('macro-indicators');
    const data = applyFilter(cached.payload);
    const responseData = { ...data, _cache: { source: 'neon', ageMs: cached.ageMs, stale } };
    staleCache.set(staleKey, responseData, 3600);
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': stale ? 'STALE-NEON' : 'HIT-NEON',
        'X-Cache-Age-Ms': String(cached.ageMs),
      },
    });
  }

  const inMem = staleCache.get<Record<string, unknown>>(staleKey);
  if (inMem) {
    fireAndForgetRefresh('macro-indicators');
    return NextResponse.json(
      { ...inMem, _stale: true, _cache: { source: 'memory-stale' } },
      { headers: { 'X-Cache': 'STALE-MEMORY' } },
    );
  }

  // Path 3: provider chain (preserves original cold-start behaviour).
  fireAndForgetRefresh('macro-indicators');
  try {
    const result = await macroChain.fetch({ extra: { period } });
    let indicators = result.data.indicators ?? [];
    if (filterStr) {
      const requested = filterStr.split(',').map((s) => s.trim().toUpperCase());
      indicators = indicators.filter((ind: MacroIndicator) => {
        const sym = ((ind as MacroIndicator & { symbol?: string }).symbol ?? ind.name ?? '').toUpperCase();
        return requested.some((r) => sym.includes(r));
      });
    }
    return NextResponse.json(
      {
        data: indicators,
        count: indicators.length,
        period,
        _lineage: result.lineage,
        _cached: result.cached,
        _cache: { source: 'direct' },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'MISS-DIRECT',
        },
      },
    );
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch macro indicators', message: e instanceof Error ? e.message : 'Unknown' },
      { status: 502 },
    );
  }
}
