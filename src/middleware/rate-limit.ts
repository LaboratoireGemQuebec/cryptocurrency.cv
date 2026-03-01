/**
 * Middleware Rate Limiting
 *
 * Distributed rate limiting via Upstash Redis with in-memory fallback.
 * Also handles repeat-429 escalation (blocking abusive IPs).
 *
 * @module middleware/rate-limit
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import {
  PUBLIC_RATE_LIMIT,
  API_CLIENT_RATE_LIMIT,
  REPEAT_429_THRESHOLD,
  REPEAT_429_WINDOW_MS,
  REPEAT_429_BLOCK_MS,
} from './config';

// =============================================================================
// REPEAT-429 ESCALATION
// =============================================================================

interface RateLimitOffender {
  hits: number[];
  blockedUntil?: number;
}

const offenderMap = new Map<string, RateLimitOffender>();

// In-memory fallback when Redis/Upstash is unavailable
interface FallbackEntry { count: number; resetAt: number; }
const inMemoryFallbackMap = new Map<string, FallbackEntry>();

const MAX_OFFENDER_MAP_SIZE = 10_000;
const OFFENDER_PRUNE_INTERVAL = 300_000;
const FALLBACK_PRUNE_INTERVAL = 300_000;
let lastOffenderPrune = Date.now();
let lastFallbackPrune = Date.now();

function pruneFallbackEntries(now: number) {
  if (now - lastFallbackPrune < FALLBACK_PRUNE_INTERVAL) return;
  lastFallbackPrune = now;
  for (const [k, v] of inMemoryFallbackMap) {
    if (v.resetAt <= now) inMemoryFallbackMap.delete(k);
  }
}

function pruneOffenders(now: number) {
  if (now - lastOffenderPrune < OFFENDER_PRUNE_INTERVAL) return;
  lastOffenderPrune = now;
  pruneFallbackEntries(now);
  for (const [ip, entry] of offenderMap) {
    const recentHits = entry.hits.filter((t) => now - t < REPEAT_429_WINDOW_MS);
    if (recentHits.length === 0 && (!entry.blockedUntil || entry.blockedUntil <= now)) {
      offenderMap.delete(ip);
    }
  }
}

/** Record a 429 for an IP and return true if the client should be escalated to 403. */
export function record429(ip: string): boolean {
  const now = Date.now();
  pruneOffenders(now);
  let entry = offenderMap.get(ip);
  if (!entry) {
    if (offenderMap.size >= MAX_OFFENDER_MAP_SIZE) {
      const firstKey = offenderMap.keys().next().value;
      if (firstKey) offenderMap.delete(firstKey);
    }
    entry = { hits: [] };
    offenderMap.set(ip, entry);
  }
  if (entry.blockedUntil && entry.blockedUntil > now) return true;
  entry.hits = entry.hits.filter((t) => now - t < REPEAT_429_WINDOW_MS);
  entry.hits.push(now);
  if (entry.hits.length >= REPEAT_429_THRESHOLD) {
    entry.blockedUntil = now + REPEAT_429_BLOCK_MS;
    entry.hits = [];
    return true;
  }
  return false;
}

/** Check if an IP is currently hard-blocked from repeat 429 escalation. */
export function isRepeat429Blocked(ip: string): number | false {
  const entry = offenderMap.get(ip);
  if (!entry?.blockedUntil) return false;
  const now = Date.now();
  if (entry.blockedUntil > now) return entry.blockedUntil;
  entry.blockedUntil = undefined;
  return false;
}

// =============================================================================
// DISTRIBUTED RATE LIMIT (Upstash Redis)
// =============================================================================

let _rateLimiter: Ratelimit | null = null;
let _apiRateLimiter: Ratelimit | null = null;

function getRedisCredentials() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

function createEphemeralRedis(limit: number, windowMs: number) {
  const ephemeralStore = new Map();
  return {
    redis: {
      sadd: async () => 1 as any,
      eval: async () => [limit, Math.floor(Date.now() / 1000) + Math.floor(windowMs / 1000)] as any,
      evalsha: async () => [limit, Math.floor(Date.now() / 1000) + Math.floor(windowMs / 1000)] as any,
      scriptLoad: async () => '' as any,
    } as unknown as InstanceType<typeof Redis>,
    ephemeralCache: ephemeralStore,
  };
}

function getRateLimiter(tier: 'public' | 'api' = 'public'): Ratelimit {
  const existing = tier === 'api' ? _apiRateLimiter : _rateLimiter;
  if (existing) return existing;

  const limit = tier === 'api' ? API_CLIENT_RATE_LIMIT : PUBLIC_RATE_LIMIT;
  const prefix = tier === 'api' ? 'mw:rl:api' : 'mw:rl';
  const creds = getRedisCredentials();

  let limiter: Ratelimit;
  if (creds) {
    limiter = new Ratelimit({
      redis: new Redis(creds),
      limiter: Ratelimit.slidingWindow(limit.requests, `${limit.windowMs}ms`),
      prefix,
      analytics: true,
      enableProtection: true,
    });
  } else {
    const ephemeral = createEphemeralRedis(limit.requests, limit.windowMs);
    limiter = new Ratelimit({
      ...ephemeral,
      limiter: Ratelimit.slidingWindow(limit.requests, `${limit.windowMs}ms`),
      prefix,
    });
  }

  if (tier === 'api') _apiRateLimiter = limiter;
  else _rateLimiter = limiter;
  return limiter;
}

export async function checkRateLimit(
  key: string,
  tier: 'public' | 'api' = 'public',
): Promise<{ allowed: boolean; remaining: number; resetAt: number; limit: number }> {
  const limit = tier === 'api' ? API_CLIENT_RATE_LIMIT : PUBLIC_RATE_LIMIT;
  try {
    const limiter = getRateLimiter(tier);
    const { success, remaining, reset } = await limiter.limit(key);
    return { allowed: success, remaining, resetAt: reset, limit: limit.requests };
  } catch {
    // Conservative in-memory fallback at 50% quota during Redis outages
    const fallbackLimit = Math.max(1, Math.floor(limit.requests * 0.5));
    const now = Date.now();
    const windowKey = `fallback:${key}`;
    const entry = inMemoryFallbackMap.get(windowKey);
    if (!entry || entry.resetAt <= now) {
      inMemoryFallbackMap.set(windowKey, { count: 1, resetAt: now + limit.windowMs });
      return { allowed: true, remaining: fallbackLimit - 1, resetAt: now + limit.windowMs, limit: fallbackLimit };
    }
    entry.count++;
    if (entry.count > fallbackLimit) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt, limit: fallbackLimit };
    }
    return { allowed: true, remaining: fallbackLimit - entry.count, resetAt: entry.resetAt, limit: fallbackLimit };
  }
}

// =============================================================================
// TIER-SPECIFIC RATE LIMITER (for authenticated API keys)
// =============================================================================

const _tierLimiters = new Map<string, Ratelimit>();

function getTierRateLimiter(tier: string, dailyLimit: number): Ratelimit {
  const cacheKey = `tier:${tier}:${dailyLimit}`;
  const existing = _tierLimiters.get(cacheKey);
  if (existing) return existing;

  const creds = getRedisCredentials();

  let limiter: Ratelimit;
  if (creds) {
    limiter = new Ratelimit({
      redis: new Redis(creds),
      limiter: Ratelimit.slidingWindow(dailyLimit, '1 d'),
      prefix: `mw:tier:${tier}`,
      analytics: true,
      enableProtection: true,
    });
  } else {
    const ephemeral = createEphemeralRedis(dailyLimit, 86400000);
    limiter = new Ratelimit({
      ...ephemeral,
      limiter: Ratelimit.slidingWindow(dailyLimit, '1 d'),
      prefix: `mw:tier:${tier}`,
    });
  }

  _tierLimiters.set(cacheKey, limiter);
  return limiter;
}

export async function checkTierRateLimit(
  keyId: string,
  dailyLimit: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const tierName = dailyLimit >= 500_000 ? 'enterprise' : dailyLimit >= 50_000 ? 'pro' : 'free';
  try {
    const limiter = getTierRateLimiter(tierName, dailyLimit);
    const { success, remaining, reset } = await limiter.limit(keyId);
    return { allowed: success, remaining, resetAt: reset };
  } catch {
    const fallbackLimit = Math.max(1, Math.floor(dailyLimit * 0.5));
    const now = Date.now();
    const windowKey = `tier-fallback:${keyId}`;
    const entry = inMemoryFallbackMap.get(windowKey);
    if (!entry || entry.resetAt <= now) {
      inMemoryFallbackMap.set(windowKey, { count: 1, resetAt: now + 86400000 });
      return { allowed: true, remaining: fallbackLimit - 1, resetAt: now + 86400000 };
    }
    entry.count++;
    if (entry.count > fallbackLimit) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }
    return { allowed: true, remaining: fallbackLimit - entry.count, resetAt: entry.resetAt };
  }
}
