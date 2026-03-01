/**
 * Trusted Origin Detection
 *
 * Checks whether a request comes from a trusted Sperax origin.
 * Trusted origins bypass x402 payment and rate limiting.
 *
 * @module middleware/trusted-origins
 */

import type { NextRequest } from 'next/server';

// Exact-match origins that bypass x402 and rate limiting entirely
const TRUSTED_EXACT_ORIGINS = new Set([
  'https://sperax.live',
  'https://www.sperax.live',
  'https://speraxos.vercel.app',
  ...(process.env.X402_BYPASS_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean) ?? []),
]);

// Apex domains whose subdomains are ALSO trusted
const TRUSTED_WILDCARD_DOMAINS = ['sperax.chat', 'sperax.io'];

function isTrustedOrigin(origin: string): boolean {
  if (!origin) return false;
  if (TRUSTED_EXACT_ORIGINS.has(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    return TRUSTED_WILDCARD_DOMAINS.some((d) => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

/**
 * Determines whether a request is from a trusted SperaxOS origin.
 *
 * Checks the `Origin` header and the `x-speraxos-token` header.
 * The `Referer` header is intentionally NOT checked as it's trivially spoofable.
 */
export async function isSperaxOSRequest(request: NextRequest): Promise<boolean> {
  const origin = request.headers.get('origin') ?? '';
  if (origin && isTrustedOrigin(origin)) return true;

  const token = request.headers.get('x-speraxos-token') ?? '';
  if (token && process.env.SPERAXOS_API_SECRET) {
    try {
      const enc = new TextEncoder();
      const a = enc.encode(token);
      const b = enc.encode(process.env.SPERAXOS_API_SECRET);
      if (a.byteLength === b.byteLength && crypto.subtle) {
        const result = await (crypto.subtle as any).timingSafeEqual?.(a, b);
        if (result) return true;
      }
      // Fallback: XOR-based constant-time compare
      if (a.byteLength === b.byteLength) {
        let diff = 0;
        for (let i = 0; i < a.byteLength; i++) diff |= a[i] ^ b[i];
        if (diff === 0) return true;
      }
    } catch {
      // Comparison failed, deny
    }
  }

  return false;
}
