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
 * /api/breaking
 *
 * Refactor 2026-05-07:
 * Reads from the `breaking_news_cache` Neon table that an Inngest cron
 * (every 1 min) keeps fresh. Always responds in <2s on any tier:
 *
 *   1. SELECT one row from Neon (~200-500ms cold, faster warm)
 *   2. If row found:
 *        - slice to requested limit
 *        - translate if lang!=en (cheap on N items, not 50)
 *        - if age > 5min, fire-and-forget Inngest refresh
 *        - return JSON
 *   3. If row null (first deploy, brand-new instance):
 *        - try in-memory staleCache (per-instance fallback)
 *        - last resort: direct fetch with HARD 5s timeout
 *
 * The Inngest function `breaking-news-cache-refresh` does the heavy lifting
 * (fetchMultipleSources across 200+ feeds) without timeout pressure.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getBreakingNews } from '@/lib/crypto-news';
import { translateArticles, isLanguageSupported, SUPPORTED_LANGUAGES } from '@/lib/translate';
import { validateQuery } from '@/lib/validation-middleware';
import { breakingNewsQuerySchema } from '@/lib/schemas';
import { ApiError } from '@/lib/api-error';
import { createRequestLogger } from '@/lib/logger';
import { staleCache, generateCacheKey } from '@/lib/cache';
import { getDb } from '@/lib/db/client';
import { breakingNewsCache } from '@/lib/db/schema';
import { fireAndForgetRefresh as fireAndForgetWorker } from '@/lib/cache-read';

// Edge runtime stays for low cold-start TTFB on the read path.
export const runtime = 'edge';
export const revalidate = 60;

const CACHE_KEY = 'breaking:default';
const STALE_AFTER_MS = 5 * 60_000;
const NEON_READ_TIMEOUT_MS = 1500;
const DIRECT_FETCH_TIMEOUT_MS = 5000;

interface CachedPayload {
  articles: unknown[];
  totalCount: number;
  sources: string[];
  fetchedAt: string;
}

interface CachedRow {
  payload: CachedPayload;
  fetchedAt: Date;
}

async function readNeonCache(): Promise<CachedRow | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db
      .select({
        payload: breakingNewsCache.payload,
        fetchedAt: breakingNewsCache.fetchedAt,
      })
      .from(breakingNewsCache)
      .where(eq(breakingNewsCache.id, CACHE_KEY))
      .limit(1);
    if (rows.length === 0) return null;
    const row = rows[0];
    if (!row.payload || !row.fetchedAt) return null;
    return {
      payload: row.payload as CachedPayload,
      fetchedAt: row.fetchedAt as Date,
    };
  } catch {
    return null;
  }
}

// Refresh trigger now goes to the Cloudflare Worker /__run-job/breaking-news
// endpoint via @/lib/cache-read.fireAndForgetRefresh which already enforces
// a 30s dedup window per (url,job) pair.
function fireAndForgetRefresh(): void {
  fireAndForgetWorker('breaking-news');
}

export async function GET(request: NextRequest) {
  const logger = createRequestLogger(request);
  const startTime = Date.now();

  logger.info('Fetching breaking news (cache-backed)');

  // Validate query parameters using Zod schema
  const validation = validateQuery(request, breakingNewsQuerySchema);
  if (!validation.success) {
    return validation.error;
  }

  const { limit } = validation.data;
  const lang = request.nextUrl.searchParams.get('lang') || 'en';

  if (lang !== 'en' && !isLanguageSupported(lang)) {
    return NextResponse.json(
      {
        error: 'Unsupported language',
        message: `Language '${lang}' is not supported`,
        supported: Object.keys(SUPPORTED_LANGUAGES),
      },
      { status: 400 }
    );
  }

  try {
    // ─── Path 1: Neon cache (hot path, target <500ms) ────────────────────
    let neonTimeoutId: ReturnType<typeof setTimeout> | null = null;
    const cached = await Promise.race<CachedRow | null>([
      readNeonCache().finally(() => {
        if (neonTimeoutId) {
          clearTimeout(neonTimeoutId);
          neonTimeoutId = null;
        }
      }),
      new Promise<null>((resolve) => {
        neonTimeoutId = setTimeout(() => resolve(null), NEON_READ_TIMEOUT_MS);
      }),
    ]);

    if (cached) {
      const ageMs = Date.now() - cached.fetchedAt.getTime();
      const stale = ageMs > STALE_AFTER_MS;

      if (stale) {
        // Async refresh, never blocks the response.
        fireAndForgetRefresh();
      }

      // Slice to requested limit (default 5, max 20).
      const sliced = cached.payload.articles.slice(0, limit);
      let articlesOut = sliced;
      let translatedLang: string = 'en';

      // Translation only on the small slice — no longer on 50.
      if (lang !== 'en' && sliced.length > 0) {
        try {
          // articles shape from getBreakingNews matches translateArticles input
          articlesOut = (await translateArticles(
            sliced as Parameters<typeof translateArticles>[0],
            lang
          )) as unknown[];
          translatedLang = lang;
        } catch (translateError) {
          logger.error('Translation failed', translateError);
        }
      }

      const responseData = {
        articles: articlesOut,
        totalCount: cached.payload.totalCount,
        sources: cached.payload.sources,
        fetchedAt: cached.payload.fetchedAt,
        lang: translatedLang,
        availableLanguages: Object.keys(SUPPORTED_LANGUAGES),
        _cache: { source: 'neon', ageMs, stale },
        _timing: { durationMs: Date.now() - startTime },
      };

      // Persist into in-memory stale cache for sub-instance fallback
      const staleCacheKey = generateCacheKey('breaking', { limit, lang });
      staleCache.set(staleCacheKey, responseData, 3600);

      return NextResponse.json(responseData, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          'Access-Control-Allow-Origin': '*',
          'X-Cache': stale ? 'STALE-NEON' : 'HIT-NEON',
          'X-Cache-Age-Ms': String(ageMs),
        },
      });
    }

    // ─── Path 2: in-memory stale cache (per-edge-instance fallback) ──────
    const staleCacheKey = generateCacheKey('breaking', { limit, lang });
    const stale = staleCache.get<Record<string, unknown>>(staleCacheKey);
    if (stale) {
      logger.info('Cache miss on Neon, serving in-memory stale cache');
      // Trigger async cache rebuild for next request
      fireAndForgetRefresh();
      return NextResponse.json(
        {
          ...stale,
          _stale: true,
          _cache: { source: 'memory-stale' },
          _timing: { durationMs: Date.now() - startTime },
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
            'Access-Control-Allow-Origin': '*',
            'X-Cache': 'STALE-MEMORY',
          },
        }
      );
    }

    // ─── Path 3: last resort direct fetch (cold-start, no cache yet) ─────
    logger.warn('No cache available, falling back to direct fetch (timeout 5s)');
    fireAndForgetRefresh();

    let directTimeoutId: ReturnType<typeof setTimeout> | null = null;
    const data = await Promise.race<
      Awaited<ReturnType<typeof getBreakingNews>>
    >([
      getBreakingNews(limit).finally(() => {
        if (directTimeoutId) {
          clearTimeout(directTimeoutId);
          directTimeoutId = null;
        }
      }),
      new Promise<never>((_, reject) => {
        directTimeoutId = setTimeout(
          () => reject(new Error('Direct breaking-news fetch timed out at 5s')),
          DIRECT_FETCH_TIMEOUT_MS
        );
      }),
    ]);

    let articles = data.articles;
    let translatedLang = 'en';
    if (lang !== 'en' && articles.length > 0) {
      try {
        articles = await translateArticles(articles, lang);
        translatedLang = lang;
      } catch (translateError) {
        logger.error('Translation failed', translateError);
      }
    }

    const responseData = {
      ...data,
      articles,
      lang: translatedLang,
      availableLanguages: Object.keys(SUPPORTED_LANGUAGES),
      _cache: { source: 'direct' },
      _timing: { durationMs: Date.now() - startTime },
    };

    staleCache.set(staleCacheKey, responseData, 3600);

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'MISS-DIRECT',
      },
    });
  } catch (error) {
    logger.error('Failed to fetch breaking news', error);

    // Final stale-on-error fallback
    const staleCacheKey = generateCacheKey('breaking', { limit, lang });
    const stale = staleCache.get<Record<string, unknown>>(staleCacheKey);
    if (stale) {
      logger.info('Serving stale breaking news after upstream failure');
      return NextResponse.json(
        { ...stale, _stale: true, _cache: { source: 'error-fallback' } },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
            'Access-Control-Allow-Origin': '*',
            'X-Cache': 'STALE-ERROR-FALLBACK',
          },
        }
      );
    }

    return ApiError.internal('Failed to fetch breaking news', error);
  }
}
