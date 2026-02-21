/**
 * Combined Proxy for Next.js 16+
 *
 * Handles:
 * - Internationalization (locale detection and routing)
 * - SperaxOS origin detection — unlimited access, priority routing
 * - Rate limiting for all other callers (60 req/hour per IP)
 * - Bot detection and blocking
 * - Admin route authentication
 * - Request size validation
 * - Security headers
 * - Request ID generation
 *
 * SperaxOS trusted origins (UNLIMITED — no rate limit):
 *   https://sperax.live
 *   https://speraxos.vercel.app
 *   https://beta.sperax.chat
 *   https://sperax.chat
 *
 * @note Next.js 16 uses "proxy.ts" instead of "middleware.ts"
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 */

import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/navigation";

// =============================================================================
// INTERNATIONALIZATION
// =============================================================================

const intlMiddleware = createMiddleware(routing);

// =============================================================================
// SPERAXOS — trusted origins get UNLIMITED access and priority routing
// =============================================================================

const SPERAXOS_ORIGINS = new Set([
  "https://sperax.live",
  "https://www.sperax.live",
  "https://speraxos.vercel.app",
  "https://beta.sperax.chat",
  "https://sperax.chat",
  "https://www.sperax.chat",
]);

/**
 * Returns true if the request originates from a SperaxOS property.
 * Checks Origin header first (set on cross-origin XHR/fetch),
 * then Referer (set on navigations), and a custom token header for
 * server-to-server calls (set SPERAXOS_API_SECRET env var).
 */
function isSperaxOSRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin") ?? "";
  if (origin && SPERAXOS_ORIGINS.has(origin)) return true;

  const referer = request.headers.get("referer") ?? "";
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (SPERAXOS_ORIGINS.has(refOrigin)) return true;
    } catch {
      // malformed referer — ignore
    }
  }

  // Server-to-server: custom header with shared secret
  const speraxToken = request.headers.get("x-speraxos-token") ?? "";
  if (
    speraxToken &&
    process.env.SPERAXOS_API_SECRET &&
    speraxToken === process.env.SPERAXOS_API_SECRET
  ) {
    return true;
  }

  return false;
}

// =============================================================================
// API CONFIGURATION
// =============================================================================

const FREE_TIER_PATTERNS = [
  /^\/api\/news/,
  /^\/api\/breaking/,
  /^\/api\/sources/,
  /^\/api\/market\/coins$/,
  /^\/api\/market\/search/,
  /^\/api\/market\/coin/,
  /^\/api\/market\/global/,
  /^\/api\/market\/trending/,
  /^\/api\/market\/historical/,
  /^\/api\/trending/,
  /^\/api\/fear-greed/,
  /^\/api\/bitcoin/,
  /^\/api\/defi$/,
  /^\/api\/atom/,
  /^\/api\/rss/,
  /^\/api\/opml/,
  /^\/api\/tags/,
  /^\/api\/search/,
  /^\/api\/sentiment/,
  /^\/api\/regulatory/,
  /^\/api\/archive/,
];

const EXEMPT_PATTERNS = [
  /^\/api\/health/,
  /^\/api\/\.well-known/,
  /^\/api\/admin/,
  /^\/api\/cron/,
  /^\/api\/webhooks/,
  /^\/api\/sse/,
  /^\/api\/ws/,
];

const MAX_BODY_SIZE = 10 * 1024 * 1024;

// Public rate limit: 60 requests per hour per IP
const PUBLIC_RATE_LIMIT = { requests: 60, windowMs: 3_600_000 };

// Known bad bot patterns (Googlebot intentionally excluded for SEO)
const BLOCKED_BOTS =
  /bot|crawler|spider|scraper|wget|curl|python-requests|go-http|java\//i;
const BOT_ALLOWLIST = [
  "Googlebot",
  "Bingbot",
  "Slurp",
  "DuckDuckBot",
  "facebookexternalhit",
];

// =============================================================================
// IN-MEMORY RATE LIMIT (Edge-compatible)
// =============================================================================

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + PUBLIC_RATE_LIMIT.windowMs,
    });
    return {
      allowed: true,
      remaining: PUBLIC_RATE_LIMIT.requests - 1,
      resetAt: now + PUBLIC_RATE_LIMIT.windowMs,
    };
  }

  if (entry.count >= PUBLIC_RATE_LIMIT.requests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: PUBLIC_RATE_LIMIT.requests - entry.count,
    resetAt: entry.resetAt,
  };
}

// =============================================================================
// SECURITY HEADERS
// =============================================================================

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

// =============================================================================
// HELPERS
// =============================================================================

function matchesPattern(pathname: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(pathname));
}

function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// =============================================================================
// API HANDLER
// =============================================================================

async function handleApiRequest(request: NextRequest): Promise<NextResponse> {
  const start = Date.now();
  const pathname = request.nextUrl.pathname;
  const requestId = generateRequestId();
  const speraxos = isSperaxOSRequest(request);

  const headers: Record<string, string> = {
    "X-Request-ID": requestId,
    ...SECURITY_HEADERS,
  };

  // Tag SperaxOS requests so downstream API routes can prioritise them
  if (speraxos) {
    headers["X-Priority"] = "speraxos";
    headers["X-SperaxOS"] = "1";
    headers["Vary"] = "Origin";
  }

  // Block known bad bots from API (allow search engine crawlers)
  const ua = request.headers.get("user-agent") || "";
  if (
    BLOCKED_BOTS.test(ua) &&
    !BOT_ALLOWLIST.some((allowed) => ua.includes(allowed))
  ) {
    return NextResponse.json(
      { error: "Forbidden", code: "BOT_BLOCKED", requestId },
      { status: 403, headers },
    );
  }

  // Protect admin routes with bearer token
  if (pathname.startsWith("/api/admin") || pathname.startsWith("/admin")) {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Unauthorized", code: "ADMIN_AUTH_REQUIRED", requestId },
        { status: 401, headers },
      );
    }
  }

  if (matchesPattern(pathname, EXEMPT_PATTERNS)) {
    const res = NextResponse.next();
    Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
    res.headers.set("X-Response-Time", `${Date.now() - start}ms`);
    return res;
  }

  // Size validation
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    const len = request.headers.get("content-length");
    if (len && parseInt(len, 10) > MAX_BODY_SIZE) {
      return NextResponse.json(
        {
          error: "Request Entity Too Large",
          code: "REQUEST_TOO_LARGE",
          requestId,
        },
        { status: 413, headers },
      );
    }
  }

  // ─── Rate limiting ─────────────────────────────────────────────────────────
  // SperaxOS: UNLIMITED — skip entirely, set informational headers only.
  // Everyone else: 60 requests / hour per IP.
  // ──────────────────────────────────────────────────────────────────────────
  if (speraxos) {
    headers["X-RateLimit-Limit"] = "unlimited";
    headers["X-RateLimit-Remaining"] = "unlimited";
  } else if (matchesPattern(pathname, FREE_TIER_PATTERNS)) {
    const clientIp = getClientIp(request);
    const rl = checkRateLimit(`${clientIp}:${pathname}`);

    headers["X-RateLimit-Limit"] = PUBLIC_RATE_LIMIT.requests.toString();
    headers["X-RateLimit-Remaining"] = rl.remaining.toString();
    headers["X-RateLimit-Reset"] = new Date(rl.resetAt).toISOString();

    if (!rl.allowed) {
      const retry = Math.ceil((rl.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Rate Limit Exceeded",
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: retry,
          requestId,
        },
        {
          status: 429,
          headers: { ...headers, "Retry-After": retry.toString() },
        },
      );
    }
  }

  const res = NextResponse.next();
  Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
  res.headers.set("X-Response-Time", `${Date.now() - start}ms`);
  return res;
}

// =============================================================================
// PROXY FUNCTION
// =============================================================================

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // API routes: rate limiting + security headers
  if (pathname.startsWith("/api/")) {
    return handleApiRequest(request);
  }

  // All other routes: i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/api/:path*",
    "/",
    "/((?!_next|_vercel|feed\\.xml|.*\\.(?:ico|png|jpg|jpeg|gif|svg|xml|json|txt|js|css|woff|woff2|webp|avif)).*)",
  ],
};
