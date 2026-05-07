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
 * Middleware Configuration Constants
 *
 * Centralised constants and route patterns for the Edge middleware.
 * Kept in a separate file to improve readability and testability.
 *
 * @module middleware/config
 */

// =============================================================================
// ROUTE PATTERNS
// =============================================================================

/** Routes that are free and publicly accessible without any key or payment. */
export const FREE_TIER_PATTERNS = [
  /^\/api\/sample$/, // /api/sample — 2 headlines + 2 prices, heavily stripped
  /^\/api\/news/,    // news feeds — core product, free tier
  /^\/api\/prices/,  // market prices — free tier (coin count limited in route handler)
  /^\/api\/fear-greed$/, // fear & greed index
  /^\/api\/trending$/, // trending topics
  /^\/api\/unlocks$/, // token unlock schedule
  /^\/api\/sources/, // news sources
  /^\/api\/market/,  // market overview
  /^\/api\/coins/,   // coin list / metadata
  /^\/api\/feed/,    // RSS/Atom feed redirects
  /^\/api\/rss/,
  /^\/api\/atom/,
  /^\/api\/archive/, // historical news archive
  /^\/api\/article/, // individual article
  /^\/api\/categories/, // news categories
  /^\/api\/signals/, // market signals
  /^\/api\/status$/, // service status
  /^\/api\/exchanges/, // exchange data — used by UI components
];

/** Routes exempt from rate limiting and x402 payment. */
export const EXEMPT_PATTERNS = [
  /^\/api\/health/,
  /^\/api\/\.well-known/,
  /^\/api\/openapi\.json$/, // OpenAPI spec — must be freely accessible for x402scan discovery
  /^\/api\/cron/,
  /^\/api\/sse/,
  /^\/api\/ws/,
  /^\/api\/register$/, // API key registration — must be free
  /^\/api\/keys\//, // Key management (usage, rotate, upgrade) — auth via key itself
  /^\/api\/inngest/, // Inngest webhook — must be free for self-host scraping
  // ─── Pierre Lafrance self-host bypass 2026-05-06 ────────────────────
  // Trading V3 needs internal access to AI/data endpoints without paying x402.
  // Safe because Pierre's deploy is for private/internal use only (no public traffic).
  /^\/api\/ai\//, // Groq AI endpoints (summarize, brief, oracle, narratives, sentiment, etc.)
  /^\/api\/coinmarketcap/, // CoinMarketCap proxy
  /^\/api\/coingecko/, // CoinGecko proxy
  /^\/api\/coincap/, // CoinCap proxy
  /^\/api\/coinpaprika/, // CoinPaprika proxy
  /^\/api\/dune/, // Dune Analytics proxy
  /^\/api\/etherscan/, // Etherscan proxy
  /^\/api\/alchemy/, // Alchemy proxy
  /^\/api\/helius/, // Helius proxy (Solana)
  /^\/api\/coinglass/, // CoinGlass proxy
  /^\/api\/bitcoin/, // Bitcoin RPC/mempool
  /^\/api\/aptos/, // Aptos data
  /^\/api\/articles/, // Articles (DB-backed, fast)
  /^\/api\/breaking/, // Breaking news
  /^\/api\/summarize/, // Summarize
  /^\/api\/translate/, // Translate
  /^\/api\/classify/, // Classify
  /^\/api\/oracle/, // Oracle
  /^\/api\/relationships/, // Relationships
  /^\/api\/claims/, // Claims
  /^\/api\/anomalies/, // Anomalies
  /^\/api\/analytics/, // Analytics
  /^\/api\/charts/, // Charts
  /^\/api\/chart-analysis/, // Chart analysis
  /^\/api\/clickbait/, // Clickbait detection
  /^\/api\/citations/, // Citations
  /^\/api\/airdrops/, // Airdrops
  /^\/api\/arbitrage/, // Arbitrage
  /^\/api\/arkham/, // Arkham
  /^\/api\/bridges/, // Bridges
  /^\/api\/backtest/, // Backtest
  /^\/api\/ask/, // Ask
  /^\/api\/analyze/, // Analyze
  /^\/api\/academic/, // Academic
  /^\/api\/blog/, // Blog posts (DB read)
  // ─── cv_news_skill bridge endpoints 2026-05-06 ──────────────────────
  /^\/api\/factcheck/, // Factcheck (cv_news_detector pipeline)
  /^\/api\/forensics/, // Forensics analytics
  /^\/api\/credibility/, // Credibility scoring
  /^\/api\/entities/, // Entity extraction
  /^\/api\/sentiment/, // Sentiment analysis
  /^\/api\/social/, // Social signals
  /^\/api\/correlation/, // Correlation
  /^\/api\/influencers/, // Influencer tracking
  /^\/api\/anchor/, // AI anchor
  /^\/api\/brief/, // Brief
  /^\/api\/digest/, // Digest
  /^\/api\/explain/, // Explain
  /^\/api\/narratives/, // Narratives
  // ─── 2026-05-07 audit cv_client.py 137 wrappers - missing exempts ─────
  // Routes that exist in /src/app/api/ but were returning HTTP 402.
  // Cleared for self-host bypass after live testing.
  /^\/api\/aptos/,           // Aptos data already added above (kept duplicate-safe via dedup)
  /^\/api\/bitcoin/,         // already above
  /^\/api\/articles/,        // (already above) DB-backed, fast
  /^\/api\/breaking/,        // (already above) AI ranking
  // ─── 2026-05-07 final audit - ALL routes exist, were paywall-blocked ──
  // Verified live HTTP 402 → routes exist as route.ts files in /src/app/api/
  // Adding to EXEMPT_PATTERNS for full self-host bypass cv_news_skill V4
  /^\/api\/whale-alerts/,    // route.ts exists (whale-alerts/ + whale-alerts/context/)
  /^\/api\/funding/,         // route.ts exists
  /^\/api\/liquidations/,    // route.ts exists
  /^\/api\/derivatives/,     // route.ts exists
  /^\/api\/predictions/,     // route.ts exists
  /^\/api\/regulatory/,      // route.ts exists
  /^\/api\/macro/,           // route.ts exists
  /^\/api\/providers/,       // route.ts exists
  /^\/api\/data-sources/,    // route.ts exists
  /^\/api\/search/,          // route.ts exists
  /^\/api\/trending/,        // route.ts exists, was timeout (not paywall)
  /^\/api\/airdrops/,        // route.ts exists
  /^\/api\/arbitrage/,       // route.ts exists
  /^\/api\/anomalies/,       // route.ts exists
  /^\/api\/fear-greed/,      // route.ts exists
  /^\/api\/charts/,          // route.ts exists
  /^\/api\/chart-analysis/,  // route.ts exists
  /^\/api\/clickbait/,       // route.ts exists
  /^\/api\/whales/,          // additional whale endpoints
  /^\/api\/oracle/,          // oracle data
  /^\/api\/coinglass/,       // coinglass proxy
];

/** Endpoints that require pro or enterprise tier (AI, premium). */
export const AI_ENDPOINT_PATTERNS = [
  /^\/api\/premium\/ai\//,
  /^\/api\/v1\/ai\//,
  /^\/api\/premium\/whales\//,
  /^\/api\/premium\/smart-money/,
  /^\/api\/premium\/stream\//,
  /^\/api\/premium\/ws\//,
  /^\/api\/premium\/export\//,
  /^\/api\/premium\/analytics\//,
];

// =============================================================================
// RATE LIMIT CONFIG
// =============================================================================

export const MAX_BODY_SIZE = 10 * 1024 * 1024; // 10 MB

/** Site visitors: 10 req/hour */
export const PUBLIC_RATE_LIMIT = { requests: 100000, windowMs: 3_600_000 };
/** Programmatic API consumers (no key): 20 req/hour */
export const API_CLIENT_RATE_LIMIT = { requests: 100000, windowMs: 3_600_000 };

/**
 * Tier rate limits applied when a valid API key is present.
 *
 *   pro:       50,000 req/day
 *   enterprise: 500,000 req/day
 *
 * Free keys are no longer issued. Existing free keys are rejected.
 */
export const TIER_LIMITS: Record<string, { daily: number; perMinute: number }> =
  {
    free: { daily: 100, perMinute: 10 },
    pro: { daily: 50_000, perMinute: 500 },
    enterprise: { daily: 500_000, perMinute: 2_000 },
  };

/** Max results a sample-tier / anonymous request may receive. */
export const FREE_TIER_MAX_RESULTS = 2;

// =============================================================================
// PER-ROUTE RATE LIMITS (expensive endpoints)
// =============================================================================

/**
 * Stricter per-route rate limits for expensive operations.
 * These are checked IN ADDITION to the global tier limit.
 */
export const ROUTE_RATE_LIMITS: {
  pattern: RegExp;
  requests: number;
  windowMs: number;
  label: string;
}[] = [
  { pattern: /^\/api\/ai/, requests: 10, windowMs: 60_000, label: "ai" },
  { pattern: /^\/api\/ask/, requests: 10, windowMs: 60_000, label: "ask" },
  {
    pattern: /^\/api\/summarize/,
    requests: 20,
    windowMs: 60_000,
    label: "summarize",
  },
  {
    pattern: /^\/api\/translate/,
    requests: 10,
    windowMs: 60_000,
    label: "translate",
  },
  {
    pattern: /^\/api\/forecast/,
    requests: 10,
    windowMs: 60_000,
    label: "forecast",
  },
  {
    pattern: /^\/api\/detect/,
    requests: 20,
    windowMs: 60_000,
    label: "detect",
  },
  {
    pattern: /^\/api\/classify/,
    requests: 20,
    windowMs: 60_000,
    label: "classify",
  },
  {
    pattern: /^\/api\/factcheck/,
    requests: 10,
    windowMs: 60_000,
    label: "factcheck",
  },
  { pattern: /^\/api\/rag/, requests: 10, windowMs: 60_000, label: "rag" },
  {
    pattern: /^\/api\/vector-search/,
    requests: 20,
    windowMs: 60_000,
    label: "vector-search",
  },
  { pattern: /^\/api\/export/, requests: 5, windowMs: 60_000, label: "export" },
  {
    pattern: /^\/api\/exports/,
    requests: 5,
    windowMs: 60_000,
    label: "exports",
  },
  {
    pattern: /^\/api\/search/,
    requests: 30,
    windowMs: 60_000,
    label: "search",
  },
  {
    pattern: /^\/api\/backtest/,
    requests: 5,
    windowMs: 60_000,
    label: "backtest",
  },
];

/** Rate limit for /api/register — prevent abuse / enumeration. */
export const REGISTER_RATE_LIMIT = { requests: 5, windowMs: 3_600_000 }; // 5 per hour per IP

// =============================================================================
// API KEY EXPIRATION
// =============================================================================

/** Default key expiry in days per tier. Free keys expire after 90 days, pro after 365, enterprise after 730. */
export const KEY_EXPIRY_DAYS: Record<string, number> = {
  free: 90,
  pro: 365,
  enterprise: 730,
};

// =============================================================================
// REPEAT-429 ESCALATION
// =============================================================================

export const REPEAT_429_THRESHOLD = 10000; // 429 responses before escalation (raised for self-host personal use)
export const REPEAT_429_WINDOW_MS = 600_000; // 10-minute rolling window
export const REPEAT_429_BLOCK_MS = 3_600_000; // 1-hour hard block after escalation

// =============================================================================
// SPERAXOS CONFIGURATION
// =============================================================================

/** Global rate limit for SperaxOS-authenticated requests. Per-key overrides take precedence. */
export const SPERAXOS_RATE_LIMIT = { daily: 100_000, perMinute: 1_000 };

/**
 * Default allowed route prefixes for SperaxOS keys.
 * Keys without explicit route scopes are restricted to these patterns.
 * Sensitive endpoints (admin, keys, register, cron) are excluded by default.
 */
export const SPERAXOS_DEFAULT_ALLOWED_ROUTES: RegExp[] = [
  /^\/api\/news/,
  /^\/api\/prices/,
  /^\/api\/market/,
  /^\/api\/trending/,
  /^\/api\/sources/,
  /^\/api\/search/,
  /^\/api\/archive/,
  /^\/api\/sentiment/,
  /^\/api\/categories/,
  /^\/api\/coins/,
  /^\/api\/feed/,
  /^\/api\/rss/,
  /^\/api\/atom/,
  /^\/api\/batch/,
  /^\/api\/sample/,
  /^\/api\/health/,
  /^\/api\/status/,
  /^\/api\/article/,
  /^\/api\/signals/,
  /^\/api\/v1\//,
  /^\/api\/summarize/,
  /^\/api\/translate/,
  /^\/api\/detect/,
  /^\/api\/classify/,
  /^\/api\/ask/,
  /^\/api\/forecast/,
  /^\/api\/factcheck/,
];

// =============================================================================
// HELPERS
// =============================================================================

export function findRouteRateLimit(
  pathname: string,
): (typeof ROUTE_RATE_LIMITS)[number] | null {
  return ROUTE_RATE_LIMITS.find((r) => r.pattern.test(pathname)) ?? null;
}

export function matchesPattern(pathname: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(pathname));
}

export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${crypto.randomUUID().slice(0, 8)}`;
}

export function getClientIp(request: {
  headers: { get(name: string): string | null };
}): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
