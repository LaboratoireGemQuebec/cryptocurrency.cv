import { type NextRequest, NextResponse } from 'next/server';
import {
  getValidatorEffectiveness,
  getNetworkOverview,
  getOperators,
} from '@/lib/apis/rated';

export const runtime = 'edge';
export const revalidate = 600;

/**
 * GET /api/validators
 *
 * Ethereum validator effectiveness & staking operator data from Rated Network.
 *
 * Query params:
 *   ?view=network     — network overview (participation rate, APR, etc.)
 *   ?view=operators   — staking operators ranked by size/effectiveness
 *   ?limit=50         — number of results to return
 *   (default)         — validator effectiveness rankings
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const headers = {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      'Access-Control-Allow-Origin': '*',
    };

    if (view === 'network') {
      const data = await getNetworkOverview();
      if (!data) {
        return NextResponse.json(
          { error: 'Failed to fetch network overview' },
          { status: 502 },
        );
      }
      return NextResponse.json(data, { headers });
    }

    if (view === 'operators') {
      const data = await getOperators(Math.min(limit, 200));
      return NextResponse.json(data, { headers });
    }

    // Default: validator effectiveness
    const data = await getValidatorEffectiveness(Math.min(limit, 200));
    return NextResponse.json(
      {
        count: data.length,
        validators: data,
        timestamp: new Date().toISOString(),
      },
      { headers },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch validator data' },
      { status: 500 },
    );
  }
}
