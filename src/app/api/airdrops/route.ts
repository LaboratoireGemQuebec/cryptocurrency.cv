/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 *
 * /api/airdrops - cache-backed read.
 *
 * Refactor 2026-05-07: reads `airdrops_cache` (static curated list refreshed
 * hourly by the news-aggregator Worker).
 */

import { type NextRequest, NextResponse } from 'next/server';
import { airdropsCache } from '@/lib/db/schema';
import { readNeonCache, fireAndForgetRefresh } from '@/lib/cache-read';
import { staleCache, generateCacheKey } from '@/lib/cache';

const CACHE_KEY = 'airdrops:default';
const STALE_AFTER_MS = 60 * 60_000;

interface Airdrop {
  id: string;
  name: string;
  token: string;
  chain: string;
  status: 'active' | 'upcoming' | 'ended';
  estimatedValue: string;
  difficulty: 'easy' | 'medium' | 'hard';
  verified: boolean;
  claimDeadline?: string;
}

interface AirdropsPayload {
  airdrops: Airdrop[];
  total: number;
  active: number;
  upcoming: number;
  fetchedAt?: string;
}

const FALLBACK: Airdrop[] = [
  { id: '1', name: 'LayerZero Season 2', token: 'ZRO', chain: 'Multi-chain', status: 'upcoming', estimatedValue: '$200-2,000', difficulty: 'medium', verified: false },
  { id: '2', name: 'Berachain', token: 'BERA', chain: 'Berachain', status: 'upcoming', estimatedValue: '$500-5,000', difficulty: 'medium', verified: false },
  { id: '3', name: 'Monad', token: 'MON', chain: 'Monad', status: 'upcoming', estimatedValue: '$1,000-10,000', difficulty: 'easy', verified: false },
  { id: '4', name: 'Scroll Airdrop', token: 'SCR', chain: 'Scroll', status: 'active', estimatedValue: '$100-1,000', difficulty: 'easy', verified: true, claimDeadline: '2026-04-30' },
  { id: '5', name: 'Hyperliquid Season 2', token: 'HYPE', chain: 'Hyperliquid', status: 'upcoming', estimatedValue: '$500-5,000', difficulty: 'medium', verified: false },
  { id: '6', name: 'Starknet STRK Round 2', token: 'STRK', chain: 'StarkNet', status: 'upcoming', estimatedValue: '$100-500', difficulty: 'hard', verified: false },
];

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const status = sp.get('status');
  const limit = parseInt(sp.get('limit') || '50', 10);
  const staleKey = generateCacheKey('airdrops', { status: status ?? 'all', limit });

  const cached = await readNeonCache<AirdropsPayload>(airdropsCache, CACHE_KEY);
  let source = 'neon';
  let stale = false;
  let ageMs = 0;
  let payload: AirdropsPayload | null = cached?.payload ?? null;
  if (cached) {
    ageMs = cached.ageMs;
    stale = ageMs > STALE_AFTER_MS;
    if (stale) fireAndForgetRefresh('airdrops');
  } else {
    source = 'fallback-static';
    payload = { airdrops: FALLBACK, total: FALLBACK.length, active: FALLBACK.filter((a) => a.status === 'active').length, upcoming: FALLBACK.filter((a) => a.status === 'upcoming').length };
    fireAndForgetRefresh('airdrops');
  }

  let filtered = payload!.airdrops;
  if (status) filtered = filtered.filter((a) => a.status === status);
  filtered = filtered.slice(0, limit);
  const responseData = {
    airdrops: filtered,
    total: filtered.length,
    active: payload!.airdrops.filter((a) => a.status === 'active').length,
    upcoming: payload!.airdrops.filter((a) => a.status === 'upcoming').length,
    _cache: { source, ageMs, stale },
  };
  staleCache.set(staleKey, responseData, 3600);
  return NextResponse.json(responseData, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      'Access-Control-Allow-Origin': '*',
      'X-Cache': source === 'neon' ? (stale ? 'STALE-NEON' : 'HIT-NEON') : 'MISS-DIRECT',
      'X-Cache-Age-Ms': String(ageMs),
    },
  });
}
