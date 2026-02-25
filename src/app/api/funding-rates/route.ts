import { NextResponse } from 'next/server';
import { getPipelineFundingRates } from '@/lib/data-pipeline';

/**
 * Funding Rates API Proxy
 *
 * Serves pipeline-cached funding rates first, then falls back to
 * proxying requests to the Binance Futures premiumIndex endpoint.
 */
export async function GET() {
  try {
    // Pipeline cache-first: serve pre-fetched funding rates
    try {
      const pipelineData = await getPipelineFundingRates();
      if (pipelineData && Array.isArray(pipelineData) && pipelineData.length > 0) {
        return NextResponse.json(pipelineData, {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
            'Access-Control-Allow-Origin': '*',
            'X-Cache': 'PIPELINE',
          },
        });
      }
    } catch { /* pipeline miss — fetch upstream */ }

    const response = await fetch('https://fapi.binance.com/fapi/v1/premiumIndex', {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Binance API error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Funding rates proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch funding rates' },
      { status: 500 }
    );
  }
}
