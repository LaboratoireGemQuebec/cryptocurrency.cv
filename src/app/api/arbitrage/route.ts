/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 *
 * /api/arbitrage
 *
 * Refactor 2026-05-07: GET reads from `arbitrage_cache` (Worker scans every
 * minute). POST (subscribe/test) preserved 1:1 from the original.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { arbitrageCache } from '@/lib/db/schema';
import { readNeonCache, fireAndForgetRefresh } from '@/lib/cache-read';
import { staleCache, generateCacheKey } from '@/lib/cache';

export const runtime = 'edge';
export const revalidate = 5;

const CACHE_KEY = 'arbitrage:default';
const STALE_AFTER_MS = 2 * 60_000;

interface ArbitrageOpportunity {
  symbol: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  spreadPercent: number;
  netProfitPercent: number;
  volume24h: number;
  detectedAt: number;
}

interface ArbitragePayload {
  opportunities: ArbitrageOpportunity[];
  triangular: { exchanges: string[]; path: string[]; profitPercent: number }[];
  summary: { scannedPairs: number; scanDuration: number; opportunitiesFound: number };
  fetchedAt: string;
}

function applyFilters(
  payload: ArbitragePayload,
  symbol: string | null,
  exchange: string | null,
  minProfit: number,
  limit: number,
  includeTriangular: boolean,
) {
  let opps = payload.opportunities;
  let tri = payload.triangular;
  if (symbol) {
    opps = opps.filter((o) => o.symbol === symbol);
    tri = tri.filter((t) => t.path.some((p) => symbol.includes(p)));
  }
  if (exchange) {
    opps = opps.filter((o) => o.buyExchange === exchange || o.sellExchange === exchange);
    tri = tri.filter((t) => t.exchanges.includes(exchange));
  }
  if (minProfit > 0) {
    opps = opps.filter((o) => o.netProfitPercent >= minProfit);
    tri = tri.filter((t) => t.profitPercent >= minProfit);
  }
  opps = opps.slice(0, limit);
  tri = includeTriangular ? tri.slice(0, Math.ceil(limit / 5)) : [];
  return {
    opportunities: opps,
    triangular: tri,
    summary: payload.summary,
    fetchedAt: payload.fetchedAt,
  };
}

export async function GET(request: NextRequest) {
  const sp = new URL(request.url).searchParams;
  const symbol = sp.get('symbol')?.toUpperCase() ?? null;
  const minProfit = parseFloat(sp.get('minProfit') || '0.1');
  const exchange = sp.get('exchange')?.toLowerCase() ?? null;
  const limit = parseInt(sp.get('limit') || '50', 10);
  const includeTriangular = sp.get('includeTriangular') !== 'false';
  const monitorStatus = sp.get('monitor') === 'true';

  const staleKey = generateCacheKey('arbitrage', { symbol: symbol ?? 'all', exchange: exchange ?? 'all', minProfit, limit });

  if (monitorStatus) {
    return NextResponse.json({
      success: true,
      data: { running: true, source: 'cf-worker', cron: '* * * * * UTC' },
    });
  }

  const cached = await readNeonCache<ArbitragePayload>(arbitrageCache, CACHE_KEY);
  if (cached) {
    const stale = cached.ageMs > STALE_AFTER_MS;
    if (stale) fireAndForgetRefresh('arbitrage');
    const data = applyFilters(cached.payload, symbol, exchange, minProfit, limit, includeTriangular);
    const responseData = {
      success: true,
      data,
      meta: {
        filters: { symbol: symbol ?? 'all', minProfit, exchange: exchange ?? 'all', limit },
        performance: data.summary,
      },
      disclaimer: 'Arbitrage opportunities are time-sensitive. Verify before trading.',
      _cache: { source: 'neon', ageMs: cached.ageMs, stale },
    };
    staleCache.set(staleKey, responseData, 3600);
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3, stale-while-revalidate=5',
        'X-Cache': stale ? 'STALE-NEON' : 'HIT-NEON',
        'X-Cache-Age-Ms': String(cached.ageMs),
      },
    });
  }

  const inMem = staleCache.get<Record<string, unknown>>(staleKey);
  if (inMem) {
    fireAndForgetRefresh('arbitrage');
    return NextResponse.json(
      { ...inMem, _stale: true, _cache: { source: 'memory-stale' } },
      { headers: { 'X-Cache': 'STALE-MEMORY' } },
    );
  }

  fireAndForgetRefresh('arbitrage');
  return NextResponse.json(
    {
      success: true,
      data: {
        opportunities: [],
        triangular: [],
        summary: { scannedPairs: 0, scanDuration: 0, opportunitiesFound: 0 },
        fetchedAt: new Date().toISOString(),
      },
      meta: { filters: {}, performance: {} },
      disclaimer: 'Cache warming up.',
      _cache: { source: 'empty' },
    },
    { headers: { 'X-Cache': 'MISS-DIRECT' } },
  );
}

// POST handler preserved 1:1 from the original (alert subscriptions / test).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, webhook_url, min_profit, symbols, exchanges } = body;

    if (action === 'subscribe') {
      if (!webhook_url) return NextResponse.json({ error: 'webhook_url is required' }, { status: 400 });
      const subscriptionId = crypto.randomUUID();
      return NextResponse.json({
        success: true,
        subscriptionId,
        message: 'Arbitrage alert subscription created',
        config: {
          webhook_url,
          min_profit: min_profit ?? 0.1,
          symbols: symbols ?? 'all',
          exchanges: exchanges ?? 'all',
          frequency: 'real-time',
        },
        instructions: [
          'You will receive webhook notifications when opportunities are detected',
          'Notifications are sent within 1 second of detection',
          'Opportunities typically last 2-5 seconds',
          'Use /api/arbitrage?monitor=true to check system status',
        ],
      });
    }

    if (action === 'test') {
      const testPayload = {
        type: 'arbitrage_alert',
        test: true,
        opportunity: {
          symbol: 'BTCUSDT',
          buyExchange: 'binance',
          sellExchange: 'kraken',
          spread: 0.15,
          netProfit: 15.0,
        },
        timestamp: new Date().toISOString(),
      };
      if (webhook_url) {
        try {
          await fetch(webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload),
          });
          return NextResponse.json({ success: true, message: 'Test webhook sent', payload: testPayload });
        } catch (err) {
          return NextResponse.json(
            {
              success: false,
              error: 'Failed to send test webhook',
              message: err instanceof Error ? err.message : 'Unknown error',
            },
            { status: 400 },
          );
        }
      }
      return NextResponse.json({ success: true, message: 'Test payload (no webhook_url)', payload: testPayload });
    }
    return NextResponse.json({ error: 'Invalid action. Use: subscribe, test' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
