import { NextRequest, NextResponse } from 'next/server';
import {
  executeQuery,
  getLatestResults,
  getQueryResults,
  getDexVolumeByProtocol,
  getEthGasAnalytics,
  getStablecoinSupply,
  getL2TransactionComparison,
  getBridgeVolumes,
  POPULAR_QUERIES,
} from '@/lib/apis/dune';

export const runtime = 'edge';
export const revalidate = 300;

/**
 * GET /api/dune
 *
 * Dune Analytics on-chain SQL query results.
 *
 * Query params:
 *   ?query=dexVolume           — pre-built query (dexVolume | ethGas | stablecoins | l2Txs | bridges)
 *   ?queryId=12345             — run arbitrary query by ID (cached results)
 *   ?executionId=abc123        — get results for a specific execution
 *   ?execute=12345             — trigger a fresh execution and return results
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const queryId = searchParams.get('queryId');
    const executionId = searchParams.get('executionId');
    const execute = searchParams.get('execute');

    const headers = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'Access-Control-Allow-Origin': '*',
    };

    // Pre-built analytics queries
    if (query) {
      let data: unknown = null;

      switch (query) {
        case 'dexVolume':
          data = await getDexVolumeByProtocol();
          break;
        case 'ethGas':
          data = await getEthGasAnalytics();
          break;
        case 'stablecoins':
          data = await getStablecoinSupply();
          break;
        case 'l2Txs':
          data = await getL2TransactionComparison();
          break;
        case 'bridges':
          data = await getBridgeVolumes();
          break;
        default:
          return NextResponse.json(
            {
              error: `Unknown query: ${query}`,
              available: ['dexVolume', 'ethGas', 'stablecoins', 'l2Txs', 'bridges'],
            },
            { status: 400 },
          );
      }

      if (!data) {
        return NextResponse.json(
          { error: 'DUNE_API_KEY not configured or query failed', query },
          { status: 503 },
        );
      }

      return NextResponse.json(
        { query, data, timestamp: new Date().toISOString() },
        { headers },
      );
    }

    // Get results for a specific execution
    if (executionId) {
      const data = await getQueryResults(executionId);
      if (!data) {
        return NextResponse.json(
          { error: 'Execution not found or still running', executionId },
          { status: 404 },
        );
      }
      return NextResponse.json(data, { headers });
    }

    // Run a fresh execution
    if (execute) {
      const data = await executeQuery(parseInt(execute, 10));
      if (!data) {
        return NextResponse.json(
          { error: 'Query execution failed or timed out', queryId: execute },
          { status: 500 },
        );
      }
      return NextResponse.json(data, { headers });
    }

    // Get cached results for a query ID
    if (queryId) {
      const data = await getLatestResults(parseInt(queryId, 10));
      if (!data) {
        return NextResponse.json(
          { error: 'No cached results found', queryId },
          { status: 404 },
        );
      }
      return NextResponse.json(data, { headers });
    }

    // Default: return available queries
    return NextResponse.json(
      {
        availableQueries: Object.entries(POPULAR_QUERIES).map(([name, id]) => ({
          name,
          queryId: id,
          url: `/api/dune?query=${name}`,
        })),
        usage: {
          preBuilt: '/api/dune?query=dexVolume',
          byId: '/api/dune?queryId=12345',
          execute: '/api/dune?execute=12345',
          executionResult: '/api/dune?executionId=abc123',
        },
        timestamp: new Date().toISOString(),
      },
      { headers },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Dune data', message: String(error) },
      { status: 500 },
    );
  }
}
