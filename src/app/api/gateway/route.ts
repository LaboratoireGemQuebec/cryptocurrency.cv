/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import { type NextRequest, NextResponse } from 'next/server';
import { getLatestNews, searchNews, getDefiNews, getBitcoinNews, getBreakingNews, getSources } from '@/lib/crypto-news';

export const runtime = 'edge';

interface GatewayRequest {
  apiName: string;
  arguments?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { apiName, arguments: argsString } = await request.json() as GatewayRequest;
    const args = argsString ? JSON.parse(argsString) : {};

    let result;
    switch (apiName) {
      case 'getLatestNews':
        result = await getLatestNews(args.limit || 10, args.source);
        break;
      case 'searchNews':
        result = await searchNews(args.keywords || '', args.limit || 10);
        break;
      case 'getDefiNews':
        result = await getDefiNews(args.limit || 10);
        break;
      case 'getBitcoinNews':
        result = await getBitcoinNews(args.limit || 10);
        break;
      case 'getBreakingNews':
        result = await getBreakingNews(args.limit || 5);
        break;
      case 'getSources':
        result = await getSources();
        break;
      default:
        return NextResponse.json({ error: `Unknown API: ${apiName}` }, { status: 400 });
    }

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gateway error' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
