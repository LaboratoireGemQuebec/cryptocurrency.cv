/**
 * Bot Detection Module
 *
 * Identifies and blocks known scrapers/crawlers while allowing
 * legitimate bots (search engines, x402 clients, etc.).
 *
 * @module middleware/bot-detection
 */

import type { NextRequest } from 'next/server';

// Known bad bot patterns (Googlebot intentionally excluded for SEO)
const BLOCKED_BOTS =
  /bot|crawler|spider|scraper|wget|curl|python-requests|aiohttp|go-http|java\/|alphahunter/i;

const BOT_ALLOWLIST = [
  'Googlebot',
  'Bingbot',
  'Slurp',
  'DuckDuckBot',
  'facebookexternalhit',
  'x402',      // x402 payment clients
  'coinbase',  // Coinbase Wallet SDK
];

// SDK / programmatic client User-Agent patterns
const SDK_UA_PATTERNS = /fcn-sdk|free-crypto-news|axios|node-fetch|undici|python-httpx|guzzle|x402-client/i;

/**
 * Returns true if the user-agent should be blocked.
 */
export function isBlockedBot(ua: string): boolean {
  return (
    BLOCKED_BOTS.test(ua) &&
    !BOT_ALLOWLIST.some((allowed) => ua.toLowerCase().includes(allowed.toLowerCase()))
  );
}

/**
 * Detect whether the caller is a programmatic API consumer vs a browser visitor.
 */
export function isApiClient(request: NextRequest): boolean {
  if (request.headers.get('x-api-key')) return true;
  if (request.headers.get('x-batch-request') === '1') return true;
  const accept = request.headers.get('accept') ?? '';
  if (accept.includes('application/json') && !accept.includes('text/html')) return true;
  const ua = request.headers.get('user-agent') ?? '';
  if (SDK_UA_PATTERNS.test(ua)) return true;
  return false;
}
