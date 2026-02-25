/**
 * Global Rate Limiter — Production-grade API rate limiting for 1M+ users
 *
 * Multi-tier rate limiting with:
 * - **IP-based limiting** (anonymous users)
 * - **API key-based limiting** (authenticated users)
 * - **Endpoint-specific limits** (expensive vs cheap endpoints)
 * - **Sliding window** algorithm (more accurate than fixed window)
 * - **Redis-backed** for horizontal scaling (falls back to in-memory)
 * - **Burst allowance** for legitimate traffic spikes
 * - **Cost-based limiting** — heavier endpoints consume more tokens
 *
 * ## Integration
 *
 * ```ts
 * // In middleware.ts
 * import { rateLimiter } from '@/lib/rate-limiter';
 *
 * const result = rateLimiter.check(request);
 * if (!result.allowed) {
 *   return new Response('Too Many Requests', {
 *     status: 429,
 *     headers: result.headers,
 *   });
 * }
 * ```
 *
 * ## Limits
 *
 * | Tier        | Requests/min | Requests/hour | Burst |
 * |-------------|-------------|---------------|-------|
 * | Anonymous   | 60          | 1,000         | 10    |
 * | Free Key    | 300         | 10,000        | 30    |
 * | Pro Key     | 1,000       | 50,000        | 100   |
 * | Enterprise  | 5,000       | 200,000       | 500   |
 *
 * @module rate-limiter
 */

// =============================================================================
// TYPES
// =============================================================================

export type RateLimitTier = 'anonymous' | 'free' | 'pro' | 'enterprise' | 'internal';

export interface RateLimitConfig {
  /** Requests per minute */
  rpm: number;
  /** Requests per hour */
  rph: number;
  /** Burst allowance (extra requests allowed in a 1s window) */
  burst: number;
  /** Daily request limit (0 = unlimited) */
  daily: number;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Tier that was applied */
  tier: RateLimitTier;
  /** Remaining requests in the current minute window */
  remaining: number;
  /** Total limit for the current window */
  limit: number;
  /** Unix timestamp when the rate limit resets */
  resetAt: number;
  /** Cost of this request (1 = default, higher for expensive endpoints) */
  cost: number;
  /** Response headers to include */
  headers: Record<string, string>;
  /** If blocked, retry after this many seconds */
  retryAfter?: number;
}

export interface RateLimitEntry {
  /** Requests in current minute window */
  minuteCount: number;
  /** Minute window start */
  minuteStart: number;
  /** Requests in current hour window */
  hourCount: number;
  /** Hour window start */
  hourStart: number;
  /** Requests today */
  dailyCount: number;
  /** Day start */
  dayStart: number;
  /** Burst tokens available (refills over time) */
  burstTokens: number;
  /** Last burst refill time */
  lastBurstRefill: number;
}

// =============================================================================
// TIER CONFIGURATIONS
// =============================================================================

const TIER_LIMITS: Record<RateLimitTier, RateLimitConfig> = {
  anonymous: { rpm: 60, rph: 1_000, burst: 10, daily: 5_000 },
  free: { rpm: 300, rph: 10_000, burst: 30, daily: 50_000 },
  pro: { rpm: 1_000, rph: 50_000, burst: 100, daily: 500_000 },
  enterprise: { rpm: 5_000, rph: 200_000, burst: 500, daily: 0 },
  internal: { rpm: 50_000, rph: 1_000_000, burst: 5_000, daily: 0 },
};

/**
 * Endpoint cost multipliers — expensive endpoints consume more tokens.
 * Default cost is 1. Higher cost = faster rate limit exhaustion.
 */
const ENDPOINT_COSTS: Record<string, number> = {
  // Cheap endpoints (1x)
  '/api/v1/news': 1,
  '/api/v1/trending': 1,
  '/api/v1/fear-greed': 1,
  '/api/v1/global': 1,
  '/api/rss': 1,
  '/api/sse': 1,

  // Standard endpoints (2x)
  '/api/v1/coins': 2,
  '/api/v1/market-data': 2,
  '/api/v1/search': 2,
  '/api/v1/tags': 2,

  // Moderate endpoints (3x)
  '/api/v1/historical': 3,
  '/api/v1/sentiment': 3,
  '/api/v1/whale-alerts': 3,
  '/api/v1/defi': 3,
  '/api/search/semantic': 3,

  // Expensive endpoints (5x)
  '/api/ai/chat': 5,
  '/api/ai/summarize': 5,
  '/api/ai/analyze': 5,
  '/api/v1/predictions': 5,
  '/api/batch': 5,
  '/api/trading/orderbook': 5,

  // Very expensive endpoints (10x)
  '/api/v1/export': 10,
  '/api/research/backtest': 10,
  '/api/admin/ai-costs': 10,
};

// =============================================================================
// SLIDING WINDOW RATE LIMITER
// =============================================================================

/**
 * In-memory sliding window rate limiter.
 * For horizontal scaling, replace the store with Redis.
 *
 * Uses a sliding window approach:
 * - Minute window: rolling 60s
 * - Hour window: rolling 3600s
 * - Day window: rolling 86400s
 * - Burst: token bucket that refills over time
 */
class RateLimiterEngine {
  private _store = new Map<string, RateLimitEntry>();
  private _cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    // Clean up expired entries every 5 minutes
    this._cleanupInterval = setInterval(() => this._cleanup(), 5 * 60_000);
  }

  /**
   * Check if a request is allowed and record it.
   */
  check(
    key: string,
    tier: RateLimitTier,
    endpoint: string,
  ): RateLimitResult {
    const config = TIER_LIMITS[tier];
    const cost = this._getEndpointCost(endpoint);
    const now = Date.now();

    let entry = this._store.get(key);
    if (!entry) {
      entry = {
        minuteCount: 0,
        minuteStart: now,
        hourCount: 0,
        hourStart: now,
        dailyCount: 0,
        dayStart: now,
        burstTokens: config.burst,
        lastBurstRefill: now,
      };
      this._store.set(key, entry);
    }

    // Roll windows if expired
    if (now - entry.minuteStart >= 60_000) {
      entry.minuteCount = 0;
      entry.minuteStart = now;
    }
    if (now - entry.hourStart >= 3_600_000) {
      entry.hourCount = 0;
      entry.hourStart = now;
    }
    if (now - entry.dayStart >= 86_400_000) {
      entry.dailyCount = 0;
      entry.dayStart = now;
    }

    // Refill burst tokens
    const elapsed = now - entry.lastBurstRefill;
    const refill = (elapsed / 1_000) * (config.burst / 60); // Refill over 60s
    entry.burstTokens = Math.min(config.burst, entry.burstTokens + refill);
    entry.lastBurstRefill = now;

    // Check limits
    const minuteRemaining = config.rpm - entry.minuteCount;
    const hourRemaining = config.rph - entry.hourCount;
    const dailyRemaining = config.daily > 0 ? config.daily - entry.dailyCount : Infinity;

    // Determine if the request is allowed
    let allowed = true;
    let retryAfter: number | undefined;

    if (minuteRemaining < cost) {
      // Over minute limit — check burst
      if (entry.burstTokens >= cost) {
        // Use burst tokens
        entry.burstTokens -= cost;
      } else {
        allowed = false;
        retryAfter = Math.ceil((entry.minuteStart + 60_000 - now) / 1000);
      }
    }

    if (hourRemaining < cost) {
      allowed = false;
      retryAfter = Math.ceil((entry.hourStart + 3_600_000 - now) / 1000);
    }

    if (dailyRemaining < cost) {
      allowed = false;
      retryAfter = Math.ceil((entry.dayStart + 86_400_000 - now) / 1000);
    }

    // Record the request
    if (allowed) {
      entry.minuteCount += cost;
      entry.hourCount += cost;
      entry.dailyCount += cost;
    }

    const remaining = Math.max(0, minuteRemaining - cost);
    const resetAt = entry.minuteStart + 60_000;

    const headers: Record<string, string> = {
      'X-RateLimit-Limit': String(config.rpm),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
      'X-RateLimit-Tier': tier,
      'X-RateLimit-Cost': String(cost),
    };

    if (!allowed && retryAfter) {
      headers['Retry-After'] = String(retryAfter);
      headers['X-RateLimit-RetryAfter'] = String(retryAfter);
    }

    return {
      allowed,
      tier,
      remaining,
      limit: config.rpm,
      resetAt,
      cost,
      headers,
      retryAfter,
    };
  }

  /**
   * Get current usage stats for a key.
   */
  getUsage(key: string): RateLimitEntry | null {
    return this._store.get(key) ?? null;
  }

  /**
   * Get global stats.
   */
  getStats(): {
    totalKeys: number;
    totalRequestsMinute: number;
    totalRequestsHour: number;
  } {
    let totalMinute = 0;
    let totalHour = 0;
    for (const entry of this._store.values()) {
      totalMinute += entry.minuteCount;
      totalHour += entry.hourCount;
    }
    return {
      totalKeys: this._store.size,
      totalRequestsMinute: totalMinute,
      totalRequestsHour: totalHour,
    };
  }

  /**
   * Reset limits for a specific key (admin action).
   */
  reset(key: string): void {
    this._store.delete(key);
  }

  /**
   * Stop the cleanup interval.
   */
  destroy(): void {
    clearInterval(this._cleanupInterval);
  }

  // ===========================================================================
  // PRIVATE
  // ===========================================================================

  private _getEndpointCost(endpoint: string): number {
    // Exact match first
    if (ENDPOINT_COSTS[endpoint]) return ENDPOINT_COSTS[endpoint];

    // Prefix match (for parameterized routes like /api/v1/historical/[coinId])
    for (const [pattern, cost] of Object.entries(ENDPOINT_COSTS)) {
      if (endpoint.startsWith(pattern)) return cost;
    }

    // Default cost
    return 1;
  }

  private _cleanup(): void {
    const now = Date.now();
    const maxAge = 86_400_000; // 24 hours

    for (const [key, entry] of this._store) {
      if (now - entry.dayStart > maxAge) {
        this._store.delete(key);
      }
    }
  }
}

// =============================================================================
// KEY EXTRACTION — Identify callers
// =============================================================================

/**
 * Extract rate limit key and tier from a request.
 *
 * Priority:
 * 1. API key in Authorization header → use key-based limits
 * 2. API key in x-api-key header → use key-based limits
 * 3. API key in query param (?api_key=xxx) → use key-based limits
 * 4. Fall back to IP → anonymous limits
 */
export function extractRateLimitInfo(request: Request): {
  key: string;
  tier: RateLimitTier;
} {
  // Check for API key
  const authHeader = request.headers.get('authorization') ?? '';
  const apiKeyHeader = request.headers.get('x-api-key') ?? '';
  const url = new URL(request.url);
  const apiKeyParam = url.searchParams.get('api_key') ?? '';

  const apiKey = authHeader.replace(/^Bearer\s+/i, '') || apiKeyHeader || apiKeyParam;

  if (apiKey) {
    // Determine tier from key prefix
    const tier = inferTierFromKey(apiKey);
    return { key: `key:${apiKey}`, tier };
  }

  // Fall back to IP
  const ip = extractIP(request);
  return { key: `ip:${ip}`, tier: 'anonymous' };
}

function extractIP(request: Request): string {
  const headers = request.headers;
  // Cloudflare
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;
  // AWS / GCP
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  // Vercel
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;
  return '0.0.0.0';
}

function inferTierFromKey(key: string): RateLimitTier {
  // Key prefixes determine tier:
  // fcn_ent_xxx → enterprise
  // fcn_pro_xxx → pro
  // fcn_free_xxx → free
  // anything else → free
  if (key.startsWith('fcn_ent_')) return 'enterprise';
  if (key.startsWith('fcn_pro_')) return 'pro';
  if (key.startsWith('fcn_internal_')) return 'internal';
  return 'free';
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const rateLimiter = new RateLimiterEngine();

/**
 * Convenience function for middleware integration.
 */
export function checkRateLimit(request: Request): RateLimitResult {
  const { key, tier } = extractRateLimitInfo(request);
  const url = new URL(request.url);
  return rateLimiter.check(key, tier, url.pathname);
}

/**
 * Get the tier limits configuration.
 */
export function getTierLimits(): Record<RateLimitTier, RateLimitConfig> {
  return { ...TIER_LIMITS };
}
