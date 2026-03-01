import { type NextRequest, NextResponse } from 'next/server';
import { getAaveLendingRates } from '@/lib/apis/thegraph';

export const runtime = 'edge';
export const revalidate = 300;

/**
 * GET /api/onchain/aave/rates
 * Returns Aave V3 lending and borrowing rates from The Graph
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const chain = (searchParams.get('chain') || 'ethereum') as keyof typeof import('@/lib/apis/thegraph') extends never ? string : 'ethereum' | 'arbitrum' | 'optimism' | 'polygon';

  try {
    const data = await getAaveLendingRates(chain as 'ethereum' | 'arbitrum' | 'optimism' | 'polygon');
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Aave lending rates' },
      { status: 500 }
    );
  }
}
