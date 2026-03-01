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
 * Google Search Console Verification
 * 
 * This file serves the Google Search Console verification token.
 * Replace GOOGLE_SITE_VERIFICATION with your actual verification token.
 * 
 * To get your token:
 * 1. Go to https://search.google.com/search-console
 * 2. Add your property (https://cryptocurrency.cv)
 * 3. Choose "HTML tag" verification method
 * 4. Copy the content value from the meta tag
 * 5. Set GOOGLE_SITE_VERIFICATION environment variable
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const verificationToken = process.env.GOOGLE_SITE_VERIFICATION;
  
  if (!verificationToken) {
    return new NextResponse('Verification token not configured', { status: 404 });
  }
  
  return new NextResponse(`google-site-verification: ${verificationToken}`, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
