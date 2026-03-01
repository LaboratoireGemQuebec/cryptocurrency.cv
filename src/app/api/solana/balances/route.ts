import { NextRequest, NextResponse } from 'next/server';
import { getTokenBalances } from '@/lib/apis/helius';

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * GET /api/solana/balances?address=<wallet>
 * Returns all token balances for a Solana wallet via Helius.
 */
export async function GET(request: NextRequest) {
  try {
    const address = new URL(request.url).searchParams.get('address');
    if (!address) {
      return NextResponse.json(
        { error: 'Missing required parameter: address' },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const data = await getTokenBalances(address);

    return NextResponse.json({
      address,
      data,
      source: 'helius',
      timestamp: new Date().toISOString(),
    }, {
      headers: { ...CORS_HEADERS, 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch token balances' },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}

export function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}
