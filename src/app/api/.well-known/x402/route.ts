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
 * x402 Well-Known Discovery Endpoint (API path)
 *
 * Serves the x402scan v1 discovery format. Reachable at:
 *   - /api/.well-known/x402  (direct)
 *   - /.well-known/x402      (via rewrite in next.config.js)
 *
 * @see https://github.com/Merit-Systems/x402scan
 */

import { NextResponse } from 'next/server';
import { API_PRICING, PREMIUM_PRICING } from '@/lib/x402/pricing';

export const revalidate = 300;

export async function GET() {
  const resources: string[] = [];

  for (const path of Object.keys(API_PRICING)) {
    resources.push(`GET ${path}`);
  }

  const postRoutes = new Set([
    '/api/premium/portfolio/analytics',
    '/api/premium/alerts/create',
  ]);

  for (const path of Object.keys(PREMIUM_PRICING)) {
    const method = postRoutes.has(path) ? 'POST' : 'GET';
    resources.push(`${method} ${path}`);
  }

  return NextResponse.json(
    { version: 1, resources },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
}
