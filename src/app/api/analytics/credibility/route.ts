/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 *
 * /api/analytics/credibility - cache-backed read.
 *
 * Refactor 2026-05-07: reads `analytics_credibility_cache` populated by the
 * news-aggregator Worker every hour. ?source= filter selects a single source.
 * ?sortBy=score|accuracy|timeliness orders the all-sources view.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { analyticsCredibilityCache } from '@/lib/db/schema';
import { readNeonCache, fireAndForgetRefresh } from '@/lib/cache-read';
import { staleCache, generateCacheKey } from '@/lib/cache';
import { jsonResponse, errorResponse, withTiming } from '@/lib/api-utils';

export const runtime = 'edge';
export const revalidate = 3600;

const CACHE_KEY = 'credibility:default';
const STALE_AFTER_MS = 60 * 60_000;

interface SourceCredibilityScore {
  source: string;
  sourceKey: string;
  tier: number;
  score: number;
  accuracyScore: number;
  timelinessScore: number;
  description?: string;
}

interface CredibilityPayload {
  sources: SourceCredibilityScore[];
  stats: { totalSources: number; averageScore: number; byTier: Record<string, number> };
  generatedAt: string;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const sp = request.nextUrl.searchParams;
  const source = sp.get('source') || undefined;
  const sortBy = (sp.get('sortBy') || 'score') as 'score' | 'accuracy' | 'timeliness';

  if (!['score', 'accuracy', 'timeliness'].includes(sortBy)) {
    return errorResponse(
      'Invalid sortBy parameter',
      'sortBy must be one of: score, accuracy, timeliness',
      400,
    );
  }
  const staleKey = generateCacheKey('credibility', { source: source ?? 'all', sortBy });

  function build(payload: CredibilityPayload) {
    if (source) {
      const found = payload.sources.find((s) => s.sourceKey === source || s.source === source);
      if (!found) {
        return null;
      }
      return { source: found, generatedAt: payload.generatedAt };
    }
    const sorted = payload.sources.slice().sort((a, b) => {
      switch (sortBy) {
        case 'accuracy':
          return b.accuracyScore - a.accuracyScore;
        case 'timeliness':
          return b.timelinessScore - a.timelinessScore;
        case 'score':
        default:
          return b.score - a.score;
      }
    });
    return { sources: sorted, stats: payload.stats, generatedAt: payload.generatedAt };
  }

  try {
    const cached = await readNeonCache<CredibilityPayload>(analyticsCredibilityCache, CACHE_KEY);
    if (cached) {
      const stale = cached.ageMs > STALE_AFTER_MS;
      if (stale) fireAndForgetRefresh('analytics-credibility');
      const data = build(cached.payload);
      if (!data && source) {
        return errorResponse('Source not found', `No credibility data for source: ${source}`, 404);
      }
      const responseData = withTiming(
        { ...data, params: { source, sortBy }, _cache: { source: 'neon', ageMs: cached.ageMs, stale } },
        startTime,
      );
      staleCache.set(staleKey, responseData, 3600);
      return jsonResponse(responseData, { cacheControl: 'ai', etag: true, request });
    }

    const inMem = staleCache.get<Record<string, unknown>>(staleKey);
    if (inMem) {
      fireAndForgetRefresh('analytics-credibility');
      return NextResponse.json(
        { ...inMem, _stale: true, _cache: { source: 'memory-stale' } },
        { headers: { 'X-Cache': 'STALE-MEMORY' } },
      );
    }

    fireAndForgetRefresh('analytics-credibility');
    return NextResponse.json(
      {
        sources: [],
        stats: { totalSources: 0, averageScore: 0, byTier: {} },
        params: { source, sortBy },
        generatedAt: new Date().toISOString(),
        _cache: { source: 'empty' },
      },
      { headers: { 'X-Cache': 'MISS-DIRECT' } },
    );
  } catch (error) {
    return errorResponse(
      'Failed to get credibility scores',
      error instanceof Error ? error.message : String(error),
    );
  }
}
