import { NextResponse } from 'next/server';
import { getPipelineGas } from '@/lib/data-pipeline';
import { registry } from '@/lib/providers/registry';
import type { GasPrice } from '@/lib/providers/adapters/gas';

export const revalidate = 30;

/**
 * GET /api/gas
 * 
 * Get current Ethereum gas prices
 * Uses pipeline cache → provider framework (Etherscan + Blocknative) → direct Etherscan fallback
 */
export async function GET() {
  try {
    // Layer 1: Pipeline cache-first
    try {
      const pipelineData = await getPipelineGas();
      if (pipelineData) {
        return NextResponse.json({
          ...pipelineData,
          _cache: 'pipeline',
        }, {
          headers: {
            'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
          },
        });
      }
    } catch { /* pipeline miss — try provider chain */ }

    // Layer 2: Provider framework (fallback between Etherscan + Blocknative with circuit breakers)
    try {
      const result = await registry.fetch<GasPrice>('gas-fees');
      return NextResponse.json({
        ...result.data,
        _cache: 'provider',
        _provider: result.lineage.provider,
        _confidence: result.lineage.confidence,
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
        },
      });
    } catch { /* provider chain miss — fall through to direct call */ }

    // Layer 3: Direct Etherscan fallback (legacy)
    const etherscanKey = process.env.ETHERSCAN_API_KEY || '';
    const etherscanUrl = `https://api.etherscan.io/api?module=gastracker&action=gasoracle${etherscanKey ? `&apikey=${etherscanKey}` : ''}`;
    
    const response = await fetch(etherscanUrl, {
      next: { revalidate: 30 },
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return NextResponse.json({
          network: 'ethereum',
          baseFee: parseFloat(data.result.suggestBaseFee) || null,
          low: {
            gwei: parseInt(data.result.SafeGasPrice),
            usd: null, // Would need ETH price to calculate
          },
          medium: {
            gwei: parseInt(data.result.ProposeGasPrice),
            usd: null,
          },
          high: {
            gwei: parseInt(data.result.FastGasPrice),
            usd: null,
          },
          lastBlock: data.result.LastBlock,
          timestamp: new Date().toISOString(),
          source: 'etherscan',
        });
      }
    }

    // Fallback: estimate based on recent blocks
    return NextResponse.json({
      network: 'ethereum',
      baseFee: null,
      low: { gwei: 20, usd: null },
      medium: { gwei: 30, usd: null },
      high: { gwei: 50, usd: null },
      lastBlock: null,
      timestamp: new Date().toISOString(),
      source: 'estimate',
      note: 'Estimates based on typical gas prices. Add ETHERSCAN_API_KEY for live data.',
    });
  } catch (error) {
    console.error('Gas API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gas prices' },
      { status: 500 }
    );
  }
}
