import { NextRequest, NextResponse } from 'next/server';
import { getAccountTransactions, getTransactionByHash } from '@/lib/apis/aptos';

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * GET /api/aptos/transactions?address=<addr>         — account transactions
 * GET /api/aptos/transactions?hash=<hash>            — transaction by hash
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const hash = searchParams.get('hash');

    if (hash) {
      const data = await getTransactionByHash(hash);
      return NextResponse.json({
        data,
        source: 'aptos-rest',
        timestamp: new Date().toISOString(),
      }, {
        headers: { ...CORS_HEADERS, 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
      });
    }

    if (!address) {
      return NextResponse.json(
        { error: 'Missing required parameter: address or hash' },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 100);
    const start = searchParams.get('start') || undefined;
    const data = await getAccountTransactions(address, { limit, start });

    return NextResponse.json({
      address,
      count: data.length,
      data,
      source: 'aptos-rest',
      timestamp: new Date().toISOString(),
    }, {
      headers: { ...CORS_HEADERS, 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Aptos transactions' },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}

export function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}
