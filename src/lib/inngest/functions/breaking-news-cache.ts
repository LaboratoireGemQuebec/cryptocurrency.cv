/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

/**
 * Breaking News Cache Refresh — Inngest Function
 *
 * Refactor 2026-05-07:
 * /api/breaking was timing out >10s on Vercel Hobby tier because it eagerly
 * aggregated 200+ RSS sources every request. Inngest runs this function on
 * a 1-minute cron (and on-demand via 'news/breaking-cache-refresh' event)
 * with a 300s budget; it writes the aggregated payload into the
 * `breaking_news_cache` table. /api/breaking then reads a single row in
 * <500ms instead of triggering the full aggregation.
 *
 * Triggers:
 *   - cron: '*\/1 * * * *'  (every minute)
 *   - event: 'news/breaking-cache-refresh'  (fire-and-forget from /api/breaking
 *     when cache age > 5 min)
 *
 * Concurrency: limit 1 (avoid double aggregation hammering 200+ feeds)
 * Retries: 2 (Inngest will retry on transient errors)
 *
 * @see /api/breaking/route.ts (consumer)
 * @see breakingNewsCache schema in src/lib/db/schema.ts
 */

import { inngest } from '../client';
import { getDb } from '@/lib/db/client';
import { breakingNewsCache } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { getBreakingNews } from '@/lib/crypto-news';

// Aggregator pulls 50 articles so the read endpoint can slice down to any
// requested limit (1..20) without re-fetching.
const AGGREGATE_LIMIT = 50;

// Cache TTL: rows older than this are considered stale (read endpoint will
// trigger an async refresh). Inngest cron runs every minute, so the typical
// observed age stays well under this threshold.
const CACHE_TTL_MS = 5 * 60_000;

export const breakingNewsCacheRefresh = inngest.createFunction(
  {
    id: 'breaking-news-cache-refresh',
    name: 'Breaking News Cache Refresh',
    retries: 2,
    concurrency: [{ limit: 1 }],
  },
  [
    { cron: '*/1 * * * *' },
    { event: 'news/breaking-cache-refresh' },
  ],
  async ({ step, logger }) => {
    const db = getDb();
    if (!db) {
      logger.warn('[breaking-news-cache] DATABASE_URL not configured, skipping');
      return { status: 'skipped', reason: 'no-database' };
    }

    // Step 1 — full aggregation across 200+ sources (no timeout pressure here)
    const data = await step.run('fetch-breaking-aggregate', async () => {
      const start = Date.now();
      const result = await getBreakingNews(AGGREGATE_LIMIT);
      const ms = Date.now() - start;
      return { ...result, _aggregateMs: ms };
    });

    // Step 2 — upsert into Neon
    await step.run('persist-cache', async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + CACHE_TTL_MS);

      const payload = {
        articles: data.articles,
        totalCount: data.totalCount,
        sources: data.sources,
        fetchedAt: data.fetchedAt,
      };

      await db
        .insert(breakingNewsCache)
        .values({
          id: 'breaking:default',
          payload,
          totalCount: data.totalCount,
          sources: data.sources,
          fetchedAt: now,
          expiresAt,
        })
        .onConflictDoUpdate({
          target: breakingNewsCache.id,
          set: {
            payload,
            totalCount: data.totalCount,
            sources: data.sources,
            fetchedAt: now,
            expiresAt,
          },
        });

      // Light retention: drop rows older than 1h that aren't 'breaking:default'.
      // Currently we only have one keyed row, but future limit-specific keys
      // would benefit from this sweep.
      await db.execute(
        sql`DELETE FROM breaking_news_cache
            WHERE id != 'breaking:default'
              AND fetched_at < NOW() - INTERVAL '1 hour'`
      );
    });

    return {
      status: 'ok',
      articles: data.articles.length,
      sources: data.sources.length,
      aggregateMs: (data as { _aggregateMs?: number })._aggregateMs ?? null,
      timestamp: new Date().toISOString(),
    };
  }
);
