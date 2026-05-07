/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 *
 * /api/analytics/influencers - cache-backed read.
 *
 * Refactor 2026-05-07: reads `influencers_cache` populated by the
 * news-aggregator Worker every 30 min. Applies request-time filtering by
 * min_credibility / category / platform / sort.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { influencersCache } from '@/lib/db/schema';
import { readNeonCache, fireAndForgetRefresh } from '@/lib/cache-read';
import { staleCache, generateCacheKey } from '@/lib/cache';

export const runtime = 'edge';
export const revalidate = 600;

const CACHE_KEY = 'influencers:default';
const STALE_AFTER_MS = 30 * 60_000;

interface InfluencerSummary {
  name: string;
  handle?: string;
  platform: string;
  category: string;
  mentionCount: number;
  recentMentions: string[];
  credibilityScore: number;
  accuracyScore: number;
  expertise: string[];
  sentiment: { bullish: number; bearish: number; neutral: number };
  trustFactors: { factor: string; weight: number; description: string }[];
}

interface InfluencersPayload {
  influencers: InfluencerSummary[];
  stats: {
    totalInfluencers: number;
    avgCredibility: number;
    avgAccuracy: number;
    byCategory: Record<string, number>;
    byPlatform: Record<string, number>;
  };
  generatedAt: string;
}

function applyFilters(
  payload: InfluencersPayload,
  minCredibility: number,
  category: string | null,
  platform: string | null,
  sortBy: string,
  limit: number,
) {
  let infs = payload.influencers.slice();
  if (minCredibility > 0) infs = infs.filter((i) => i.credibilityScore >= minCredibility);
  if (category) infs = infs.filter((i) => i.category === category);
  if (platform) infs = infs.filter((i) => i.platform === platform);
  switch (sortBy) {
    case 'accuracy':
      infs.sort((a, b) => b.accuracyScore - a.accuracyScore);
      break;
    case 'mentions':
      infs.sort((a, b) => b.mentionCount - a.mentionCount);
      break;
    case 'credibility':
    default:
      infs.sort((a, b) => b.credibilityScore - a.credibilityScore);
  }
  if (limit > 0) infs = infs.slice(0, limit);
  return infs;
}

export async function GET(request: NextRequest) {
  const sp = new URL(request.url).searchParams;
  const limit = Math.min(parseInt(sp.get('limit') || '30', 10), 50);
  const minCredibility = parseInt(sp.get('min_credibility') || '0', 10);
  const category = sp.get('category');
  const platform = sp.get('platform');
  const sortBy = sp.get('sort') || 'credibility';
  const staleKey = generateCacheKey('influencers', { limit, minCredibility, category: category ?? '', platform: platform ?? '', sortBy });

  const cached = await readNeonCache<InfluencersPayload>(influencersCache, CACHE_KEY);
  if (cached) {
    const stale = cached.ageMs > STALE_AFTER_MS;
    if (stale) fireAndForgetRefresh('influencers');
    const filtered = applyFilters(cached.payload, minCredibility, category, platform, sortBy, limit);
    const tiers = {
      trusted: filtered.filter((i) => i.credibilityScore >= 80).length,
      moderate: filtered.filter((i) => i.credibilityScore >= 50 && i.credibilityScore < 80).length,
      lowCredibility: filtered.filter((i) => i.credibilityScore < 50).length,
    };
    const responseData = {
      influencers: filtered,
      stats: cached.payload.stats,
      tiers,
      filters: { min_credibility: minCredibility, category, platform, sort: sortBy, limit },
      generatedAt: cached.payload.generatedAt,
      disclaimer: 'Credibility scores are AI-generated estimates. Always do your own research.',
      _cache: { source: 'neon', ageMs: cached.ageMs, stale },
    };
    staleCache.set(staleKey, responseData, 3600);
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        'X-Cache': stale ? 'STALE-NEON' : 'HIT-NEON',
        'X-Cache-Age-Ms': String(cached.ageMs),
      },
    });
  }

  const inMem = staleCache.get<Record<string, unknown>>(staleKey);
  if (inMem) {
    fireAndForgetRefresh('influencers');
    return NextResponse.json(
      { ...inMem, _stale: true, _cache: { source: 'memory-stale' } },
      { headers: { 'X-Cache': 'STALE-MEMORY' } },
    );
  }

  fireAndForgetRefresh('influencers');
  return NextResponse.json(
    {
      influencers: [],
      stats: { totalInfluencers: 0, avgCredibility: 0, avgAccuracy: 0, byCategory: {}, byPlatform: {} },
      tiers: { trusted: 0, moderate: 0, lowCredibility: 0 },
      filters: { min_credibility: minCredibility, category, platform, sort: sortBy, limit },
      generatedAt: new Date().toISOString(),
      disclaimer: 'Cache warming up.',
      _cache: { source: 'empty' },
    },
    { headers: { 'X-Cache': 'MISS-DIRECT' } },
  );
}
