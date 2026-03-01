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
 * x402 Discovery Route (Standard Location)
 * 
 * Redirects to the API x402 endpoint for payment discovery
 * Standard: https://x402.org
 */

import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/constants';

export const runtime = 'edge';

export async function GET() {
  // Redirect to the actual x402 API endpoint
  return NextResponse.redirect(`${SITE_URL}/api/.well-known/x402`, {
    status: 307, // Temporary redirect to allow caching
  });
}
