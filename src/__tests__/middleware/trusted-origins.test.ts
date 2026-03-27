/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 */

/**
 * Tests for trusted-origins middleware handler and utility functions
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { NextResponse, NextRequest } from 'next/server';
import {
  isTrustedOrigin,
  trustedOriginHandler,
} from '@/middleware/trusted-origins';
import type { MiddlewareContext } from '@/middleware/types';

function createContext(
  headers: Record<string, string> = {},
  overrides: Partial<MiddlewareContext> = {},
): MiddlewareContext {
  const pathname = overrides.pathname || '/api/test';
  const url = new URL('http://localhost:3000' + pathname);
  const request = new NextRequest(url, {
    headers: new Headers(headers),
  });
  return {
    request,
    requestId: 'req_test_123',
    startTime: Date.now(),
    pathname,
    isApiRoute: pathname.startsWith('/api/'),
    isEmbedRoute: false,
    isSperaxOS: false,
    speraxosKeyId: null,
    isTrustedOrigin: false,
    isApiClient: false,
    clientIp: '127.0.0.1',
    apiKeyTier: null,
    apiKeyId: null,
    headers: {},
    ...overrides,
  };
}

// =============================================================================
// isTrustedOrigin utility
// =============================================================================

describe('isTrustedOrigin', () => {
  it('should trust exact Sperax origins', () => {
    expect(isTrustedOrigin('https://chat.sperax.io')).toBe(true);
  });

  it('should trust Sperax wildcard subdomains', () => {
    expect(isTrustedOrigin('https://app.sperax.io')).toBe(true);
    expect(isTrustedOrigin('https://sub.sperax.chat')).toBe(true);
  });

  it('should trust apex wildcard domains', () => {
    expect(isTrustedOrigin('https://sperax.io')).toBe(true);
    expect(isTrustedOrigin('https://sperax.chat')).toBe(true);
  });

  it('should reject untrusted origins', () => {
    expect(isTrustedOrigin('https://evil.com')).toBe(false);
    expect(isTrustedOrigin('https://notsperax.io')).toBe(false);
  });

  it('should reject empty origins', () => {
    expect(isTrustedOrigin('')).toBe(false);
  });

  it('should handle malformed URLs gracefully', () => {
    expect(isTrustedOrigin('not-a-url')).toBe(false);
  });
});

// =============================================================================
// trustedOriginHandler composable handler
// =============================================================================

describe('trustedOriginHandler', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should skip non-API routes', () => {
    const ctx = createContext({}, { isApiRoute: false, pathname: '/about' });
    const result = trustedOriginHandler(ctx);
    expect(result).not.toBeInstanceOf(NextResponse);
    expect((result as MiddlewareContext).isSperaxOS).toBe(false);
  });

  it('should set isTrustedOrigin for trusted browser origins', () => {
    const ctx = createContext({ origin: 'https://chat.sperax.io' });
    const result = trustedOriginHandler(ctx) as MiddlewareContext;

    expect(result.isTrustedOrigin).toBe(true);
    expect(result.headers['X-SperaxOS']).toBe('1');
    expect(result.headers['Access-Control-Allow-Origin']).toBe('https://chat.sperax.io');
  });

  it('should not set trust flags for untrusted origins', () => {
    const ctx = createContext({ origin: 'https://evil.com' });
    const result = trustedOriginHandler(ctx) as MiddlewareContext;

    expect(result.isSperaxOS).toBe(false);
    expect(result.isTrustedOrigin).toBe(false);
    expect(result.headers['X-SperaxOS']).toBeUndefined();
  });

  it('should set priority headers when isSperaxOS is already true (set by HMAC handler)', () => {
    // Simulates the HMAC handler having already authenticated
    const ctx = createContext({}, { isSperaxOS: true, speraxosKeyId: 'test-key' });
    const result = trustedOriginHandler(ctx) as MiddlewareContext;

    expect(result.isSperaxOS).toBe(true);
    expect(result.headers['X-Priority']).toBe('speraxos');
    expect(result.headers['X-SperaxOS']).toBe('1');
  });

  it('should not set isTrustedOrigin when isSperaxOS is true', () => {
    // SperaxOS HMAC auth takes precedence over origin trust
    const ctx = createContext(
      { origin: 'https://chat.sperax.io' },
      { isSperaxOS: true, speraxosKeyId: 'test-key' },
    );
    const result = trustedOriginHandler(ctx) as MiddlewareContext;

    expect(result.isSperaxOS).toBe(true);
    // isTrustedOrigin is false when isSperaxOS — they're mutually exclusive
    expect(result.isTrustedOrigin).toBe(false);
  });
});
