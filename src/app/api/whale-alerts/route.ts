/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 *
 * /api/whale-alerts - cache-backed read.
 *
 * Refactor 2026-05-07: reads `whale_alerts_cache` populated by the
 * news-aggregator Worker. Filters by ?blockchain= and ?limit= at request time.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { whaleAlertsCache } from '@/lib/db/schema';
import { readNeonCache, fireAndForgetRefresh } from '@/lib/cache-read';
import { staleCache, generateCacheKey } from '@/lib/cache';

export const runtime = 'edge';
const CACHE_KEY = 'whale-alerts:default';
const STALE_AFTER_MS = 5 * 60_000;

interface WhaleTransaction {
  id: string;
  blockchain: string;
  symbol: string;
  amount: number;
  amountUsd: number;
  hash: string;
  timestamp: number;
  transactionType: string;
  significance: string;
  from: { address: string; owner?: string; ownerType?: string };
  to: { address: string; owner?: string; ownerType?: string };
}

interface WhaleAlertsPayload {
  alerts: WhaleTransaction[];
  summary: {
    totalTransactions: number;
    totalValueUsd: number;
    exchangeDeposits: number;
    exchangeWithdrawals: number;
    largestTransaction: WhaleTransaction | null;
  };
  lastUpdated: string;
}

function applyFilters(payload: WhaleAlertsPayload, blockchain: string, minValue: number, limit: number) {
  let alerts = payload.alerts;
  if (blockchain !== 'all') {
    alerts = alerts.filter((a) => a.blockchain.toLowerCase() === blockchain);
  }
  if (minValue > 0) alerts = alerts.filter((a) => a.amountUsd >= minValue);
  if (limit > 0) alerts = alerts.slice(0, limit);
  const totalUsd = alerts.reduce((s, a) => s + a.amountUsd, 0);
  const deps = alerts.filter((a) => a.transactionType === 'exchange_deposit').length;
  const wds = alerts.filter((a) => a.transactionType === 'exchange_withdrawal').length;
  const largest = alerts.length > 0 ? alerts.reduce((m, a) => (a.amountUsd > m.amountUsd ? a : m)) : null;
  return {
    alerts,
    summary: {
      totalTransactions: alerts.length,
      totalValueUsd: totalUsd,
      exchangeDeposits: deps,
      exchangeWithdrawals: wds,
      largestTransaction: largest,
    },
    lastUpdated: payload.lastUpdated,
  };
}

export async function GET(request: NextRequest) {
  const sp = new URL(request.url).searchParams;
  const blockchain = (sp.get('blockchain') || 'all').toLowerCase();
  const minValue = parseInt(sp.get('minValue') || '100000', 10);
  const limit = parseInt(sp.get('limit') || '50', 10);
  const staleKey = generateCacheKey('whale-alerts', { blockchain, minValue, limit });

  const cached = await readNeonCache<WhaleAlertsPayload>(whaleAlertsCache, CACHE_KEY);
  if (cached) {
    const stale = cached.ageMs > STALE_AFTER_MS;
    if (stale) fireAndForgetRefresh('whale-alerts');
    const data = applyFilters(cached.payload, blockchain, minValue, limit);
    const responseData = { ...data, _cache: { source: 'neon', ageMs: cached.ageMs, stale } };
    staleCache.set(staleKey, responseData, 3600);
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': stale ? 'STALE-NEON' : 'HIT-NEON',
        'X-Cache-Age-Ms': String(cached.ageMs),
      },
    });
  }

  const inMem = staleCache.get<Record<string, unknown>>(staleKey);
  if (inMem) {
    fireAndForgetRefresh('whale-alerts');
    return NextResponse.json(
      { ...inMem, _stale: true, _cache: { source: 'memory-stale' } },
      { headers: { 'X-Cache': 'STALE-MEMORY', 'Access-Control-Allow-Origin': '*' } },
    );
  }

  // Empty placeholder during cold start.
  fireAndForgetRefresh('whale-alerts');
  return NextResponse.json(
    {
      alerts: [],
      summary: {
        totalTransactions: 0,
        totalValueUsd: 0,
        exchangeDeposits: 0,
        exchangeWithdrawals: 0,
        largestTransaction: null,
      },
      lastUpdated: new Date().toISOString(),
      _cache: { source: 'empty' },
    },
    { headers: { 'X-Cache': 'MISS-DIRECT', 'Access-Control-Allow-Origin': '*' } },
  );
}
