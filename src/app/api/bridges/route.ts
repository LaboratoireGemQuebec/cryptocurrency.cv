import { NextRequest, NextResponse } from 'next/server';
import { getBridgeVolumes, getBridgeHistory } from '@/lib/apis/bridges';

export const runtime = 'edge';
export const revalidate = 300;

/**
 * GET /api/bridges
 *
 * Cross-chain bridge volumes and data from DefiLlama Bridges.
 *
 * Query params:
 *   ?bridgeId=5  — return historical volume for a specific bridge
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const bridgeId = searchParams.get('bridgeId');

    if (bridgeId) {
      const history = await getBridgeHistory(parseInt(bridgeId, 10));
      return NextResponse.json(
        { bridgeId: parseInt(bridgeId, 10), history, timestamp: new Date().toISOString() },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }

    const data = await getBridgeVolumes();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bridge data', message: String(error) },
      { status: 500 },
    );
  }
}
