/**
 * Shared Neon cache-read helper for routes refactored to read from the
 * Cloudflare Worker `news-aggregator` cache tables.
 *
 * Pattern (replicates the proven /api/breaking implementation):
 *   1. Race a SELECT against a 1500ms timer. Cache hit returns row + age.
 *   2. Caller decides whether age > stale threshold; if so, fire-and-forget
 *      a refresh trigger to the Worker via /__run.
 *   3. Caller falls back to in-memory staleCache then direct fetch on miss.
 */

import { eq } from 'drizzle-orm';
import { getDb } from './db/client';
import type {
  breakingNewsCache,
  clickbaitCache,
  aiBriefCache,
  aiDigestCache,
  trendingCache,
  whaleAlertsCache,
  airdropsCache,
  arbitrageCache,
  fearGreedCache,
  macroIndicatorsCache,
  influencersCache,
  analyticsAnomaliesCache,
  analyticsCredibilityCache,
} from './db/schema';

type CacheTable =
  | typeof breakingNewsCache
  | typeof clickbaitCache
  | typeof aiBriefCache
  | typeof aiDigestCache
  | typeof trendingCache
  | typeof whaleAlertsCache
  | typeof airdropsCache
  | typeof arbitrageCache
  | typeof fearGreedCache
  | typeof macroIndicatorsCache
  | typeof influencersCache
  | typeof analyticsAnomaliesCache
  | typeof analyticsCredibilityCache;

const NEON_READ_TIMEOUT_MS = 1500;

export interface NeonRead<T> {
  payload: T;
  fetchedAt: Date;
  ageMs: number;
}

/**
 * Race the SELECT against a 1500ms hard timeout. Returns null on miss / timeout.
 */
export async function readNeonCache<T>(
  table: CacheTable,
  id: string,
): Promise<NeonRead<T> | null> {
  const db = getDb();
  if (!db) return null;

  let timer: ReturnType<typeof setTimeout> | null = null;
  const result = await Promise.race<NeonRead<T> | null>([
    (async () => {
      try {
        const rows = await db
          .select({ payload: table.payload, fetchedAt: table.fetchedAt })
          .from(table)
          .where(eq(table.id, id))
          .limit(1);
        if (rows.length === 0) return null;
        const row = rows[0];
        if (!row.payload || !row.fetchedAt) return null;
        const fetchedAt = row.fetchedAt as Date;
        return {
          payload: row.payload as T,
          fetchedAt,
          ageMs: Date.now() - fetchedAt.getTime(),
        };
      } catch {
        return null;
      }
    })().finally(() => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }),
    new Promise<null>((resolve) => {
      timer = setTimeout(() => resolve(null), NEON_READ_TIMEOUT_MS);
    }),
  ]);

  return result;
}

// In-memory dedup window for refresh events. Edge instances are short-lived,
// but during a single instance lifetime we still avoid spamming the Worker
// with duplicate refresh events when many requests find the cache stale.
const REFRESH_DEDUP_MS = 30_000;
const _lastRefreshSentAt = new Map<string, number>();

/**
 * Fire-and-forget a refresh request to the Cloudflare Worker. The Worker's
 * /__run endpoint is auth-gated by the TRIGGER_SECRET header; if either
 * env var is missing this is a no-op.
 */
export function fireAndForgetRefresh(jobName?: string): void {
  const url = process.env.WORKER_TRIGGER_URL;
  const secret = process.env.WORKER_TRIGGER_SECRET;
  if (!url || !secret) return;

  const path = jobName ? `/__run-job/${encodeURIComponent(jobName)}` : '/__run';
  const dedupKey = `${url}${path}`;
  const now = Date.now();
  const last = _lastRefreshSentAt.get(dedupKey) ?? 0;
  if (now - last < REFRESH_DEDUP_MS) return;
  _lastRefreshSentAt.set(dedupKey, now);

  fetch(`${url}${path}`, {
    method: 'POST',
    headers: { 'x-trigger-secret': secret, 'content-type': 'application/json' },
    body: '{}',
  }).catch(() => {
    // On error, reset so a future request can retry the trigger.
    _lastRefreshSentAt.delete(dedupKey);
  });
}
