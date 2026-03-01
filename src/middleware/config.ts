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

/** Routes that are free but rate-limited and return degraded / limited results. */
export const FREE_TIER_PATTERNS = [
  /^\/api\/news($|\/)/, // /api/news — returns max 3 headlines
  /^\/api\/prices$/,    // /api/prices — returns max 3 coins
  /^\/api\/batch$/,     // /api/batch — combined requests, same per-sub-request limits
];

/** Routes exempt from rate limiting and x402 payment. */
export const EXEMPT_PATTERNS = [
  /^\/api\/health/,
  /^\/api\/\.well-known/,
  /^\/api\/admin/,
  /^\/api\/cron/,
  /^\/api\/webhooks/,
  /^\/api\/sse/,
  /^\/api\/ws/,
  /^\/api\/internal/,   // internal snapshot writer — same-origin only
  /^\/api\/register$/,  // API key registration — must be free
  /^\/api\/keys\//,     // Key management (usage, rotate, upgrade) — auth via key itself
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

/** Site visitors: 60 req/hour */
export const PUBLIC_RATE_LIMIT = { requests: 60, windowMs: 3_600_000 };
/** Programmatic API consumers: 300 req/hour */
export const API_CLIENT_RATE_LIMIT = { requests: 300, windowMs: 3_600_000 };

/**
 * Tier rate limits applied when a valid API key is present.
 *
 *   free:       1,000 req/day
 *   pro:       50,000 req/day
 *   enterprise: 500,000 req/day
 */
export const TIER_LIMITS: Record<string, { daily: number; perMinute: number }> = {
  free:       { daily: 1_000,   perMinute: 20 },
  pro:        { daily: 50_000,  perMinute: 500 },
  enterprise: { daily: 500_000, perMinute: 2_000 },
};

/** Max results a free-tier key may receive. */
export const FREE_TIER_MAX_RESULTS = 3;

// =============================================================================
// REPEAT-429 ESCALATION
// =============================================================================

export const REPEAT_429_THRESHOLD = 10;           // 429 responses before escalation
export const REPEAT_429_WINDOW_MS = 600_000;      // 10-minute rolling window
export const REPEAT_429_BLOCK_MS  = 3_600_000;    // 1-hour hard block after escalation

// =============================================================================
// HELPERS
// =============================================================================

export function matchesPattern(pathname: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(pathname));
}

export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getClientIp(request: { headers: { get(name: string): string | null } }): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
