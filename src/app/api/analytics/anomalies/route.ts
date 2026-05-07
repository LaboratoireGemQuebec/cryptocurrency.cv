/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 *
 * /api/analytics/anomalies - cache-backed read.
 *
 * Refactor 2026-05-07: reads `analytics_anomalies_cache` populated by the
 * news-aggregator Worker every minute. Filters by ?severity= and ?hours=
 * client-side; Worker payload always covers a 1h window (caller may slice).
 */

import { type NextRequest, NextResponse } from 'next/server';
import { analyticsAnomaliesCache } from '@/lib/db/schema';
import { readNeonCache, fireAndForgetRefresh } from '@/lib/cache-read';
import { staleCache, generateCacheKey } from '@/lib/cache';
import { jsonResponse, errorResponse, withTiming } from '@/lib/api-utils';

export const runtime = 'edge';
export const revalidate = 60;

const CACHE_KEY = 'anomalies:default';
const STALE_AFTER_MS = 5 * 60_000;

type AnomalySeverity = 'high' | 'medium' | 'low';

interface AnomalyEvent {
  id: string;
  type: string;
  severity: AnomalySeverity;
  description: string;
  detectedAt: string;
  metadata?: Record<string, unknown>;
}

interface AnomaliesPayload {
  anomalies: AnomalyEvent[];
  summary: {
    totalAnomalies: number;
    bySeverity: Record<AnomalySeverity, number>;
    byType: Record<string, number>;
  };
  generatedAt: string;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const sp = request.nextUrl.searchParams;
  const hours = Math.min(Math.max(parseInt(sp.get('hours') || '24', 10), 1), 168);
  const severityParam = sp.get('severity');
  let severity: AnomalySeverity | undefined;
  if (severityParam) {
    if (!['high', 'medium', 'low'].includes(severityParam)) {
      return errorResponse('Invalid severity parameter', 'severity must be one of: high, medium, low', 400);
    }
    severity = severityParam as AnomalySeverity;
  }
  const staleKey = generateCacheKey('anomalies', { hours, severity: severity ?? 'all' });

  function applyFilter(payload: AnomaliesPayload) {
    let anomalies = payload.anomalies;
    if (severity) anomalies = anomalies.filter((a) => a.severity === severity);
    const summary = {
      totalAnomalies: anomalies.length,
      bySeverity: {
        high: anomalies.filter((a) => a.severity === 'high').length,
        medium: anomalies.filter((a) => a.severity === 'medium').length,
        low: anomalies.filter((a) => a.severity === 'low').length,
      } as Record<AnomalySeverity, number>,
      byType: anomalies.reduce<Record<string, number>>((acc, a) => {
        acc[a.type] = (acc[a.type] ?? 0) + 1;
        return acc;
      }, {}),
    };
    return { anomalies, summary, params: { hours, severity }, generatedAt: payload.generatedAt };
  }

  try {
    const cached = await readNeonCache<AnomaliesPayload>(analyticsAnomaliesCache, CACHE_KEY);
    if (cached) {
      const stale = cached.ageMs > STALE_AFTER_MS;
      if (stale) fireAndForgetRefresh('analytics-anomalies');
      const data = applyFilter(cached.payload);
      const responseData = withTiming(
        { ...data, _cache: { source: 'neon', ageMs: cached.ageMs, stale } },
        startTime,
      );
      staleCache.set(staleKey, responseData, 3600);
      return jsonResponse(responseData, {
        cacheControl: 'realtime',
        etag: true,
        request,
      });
    }

    const inMem = staleCache.get<Record<string, unknown>>(staleKey);
    if (inMem) {
      fireAndForgetRefresh('analytics-anomalies');
      return NextResponse.json(
        { ...inMem, _stale: true, _cache: { source: 'memory-stale' } },
        { headers: { 'X-Cache': 'STALE-MEMORY' } },
      );
    }

    fireAndForgetRefresh('analytics-anomalies');
    const empty: AnomaliesPayload = {
      anomalies: [],
      summary: { totalAnomalies: 0, bySeverity: { high: 0, medium: 0, low: 0 }, byType: {} },
      generatedAt: new Date().toISOString(),
    };
    return NextResponse.json(
      { ...applyFilter(empty), _cache: { source: 'empty' } },
      { headers: { 'X-Cache': 'MISS-DIRECT' } },
    );
  } catch (error) {
    return errorResponse(
      'Failed to get anomaly report',
      error instanceof Error ? error.message : String(error),
    );
  }
}
