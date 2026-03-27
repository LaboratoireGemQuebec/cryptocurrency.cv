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
 * Last-Resort Fallback Layer
 *
 * Provides a guarantee that API consumers **never** see an error response,
 * even on a cold start with every upstream API down and in-memory caches empty.
 *
 * Architecture:
 *
 *   Request
 *     │
 *     ├─ 1. In-memory cache (60 s)          ← fastest, lost on restart
 *     ├─ 2. Live upstream fetch              ← real-time data
 *     ├─ 3. In-memory stale cache (1 hr)     ← recent-ish, lost on restart
 *     └─ 4. Hardcoded emergency payload      ← always available, never fails
 *
 * ## Emergency payloads
 *
 * Hardcoded data that is always in-memory, even if the filesystem is
 * completely unavailable. Outdated? Absolutely. Better than an error? Yes.
 */

// ─── Emergency Hardcoded Data (absolute last resort) ─────────────────────────

export const EMERGENCY_NEWS = {
  articles: [
    {
      title: 'Crypto market data temporarily unavailable',
      link: 'https://cryptocurrency.cv',
      description:
        'We are experiencing a temporary service disruption. Please check back shortly for the latest crypto news.',
      pubDate: new Date().toISOString(),
      source: 'Crypto Vision News',
      sourceKey: 'system',
      category: 'general',
      timeAgo: 'just now',
    },
  ],
  articleCount: 1,
  source: 'all',
  _fallback: true as const,
  _fallbackLevel: 'emergency' as string,
  _fallbackTimestamp: new Date().toISOString(),
};

export const EMERGENCY_PRICES: Record<string, unknown> = {
  _fallback: true,
  _fallbackLevel: 'emergency',
  _fallbackTimestamp: new Date().toISOString(),
};

// ─── Fallback Accessors ─────────────────────────────────────────────────────

export interface FallbackResult<T> {
  data: T;
  level: 'emergency';
}

/**
 * Emergency fallback for news — guaranteed to return data, never throws.
 */
export function getNewsFallback(): FallbackResult<typeof EMERGENCY_NEWS> {
  return { data: EMERGENCY_NEWS, level: 'emergency' };
}

/**
 * Emergency fallback for prices — guaranteed to return data, never throws.
 */
export function getPricesFallback(): FallbackResult<Record<string, unknown>> {
  return { data: EMERGENCY_PRICES, level: 'emergency' };
}
