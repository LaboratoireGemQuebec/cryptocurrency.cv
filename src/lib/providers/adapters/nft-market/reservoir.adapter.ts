/**
 * Reservoir Adapter — Aggregated NFT marketplace data
 *
 * Reservoir aggregates listings and sales across OpenSea, Blur, LooksRare, etc.
 * Free API with 120 req/min.
 *
 * @see https://docs.reservoir.tools/reference/overview
 * @module providers/adapters/nft-market/reservoir
 */

import type { DataProvider, FetchParams, RateLimitConfig } from '../../types';
import type { NFTMarketData, NFTCollection } from './types';

const RESERVOIR_BASE = 'https://api.reservoir.tools';
const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY ?? '';

const RATE_LIMIT: RateLimitConfig = { maxRequests: 120, windowMs: 60_000 };

export const reservoirAdapter: DataProvider<NFTMarketData> = {
  name: 'reservoir',
  description: 'Reservoir Protocol — aggregated NFT marketplace data',
  priority: 2,
  weight: 0.30,
  rateLimit: RATE_LIMIT,
  capabilities: ['nft-market'],

  async fetch(params: FetchParams): Promise<NFTMarketData> {
    const limit = params.limit ?? 20;

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (RESERVOIR_API_KEY) headers['x-api-key'] = RESERVOIR_API_KEY;

    const url = `${RESERVOIR_BASE}/collections/v7?sortBy=1DayVolume&limit=${Math.min(limit, 50)}`;
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });

    if (!res.ok) throw new Error(`Reservoir HTTP ${res.status}`);
    const json = await res.json();

     
    const collections: NFTCollection[] = (json.collections ?? []).map((c: any) => ({
      slug: c.slug ?? c.id ?? '',
      name: c.name ?? '',
      chain: c.chainId === 1 ? 'ethereum' : c.chainId === 137 ? 'polygon' : `chain-${c.chainId ?? 1}`,
      floorPrice: c.floorAsk?.price?.amount?.native ?? 0,
      floorPriceCurrency: c.floorAsk?.price?.currency?.symbol ?? 'ETH',
      volume24h: c.volume?.['1day'] ?? 0,
      volumeChange24h: c.volumeChange?.['1day'] ?? 0,
      sales24h: c.salesCount?.['1day'] ?? 0,
      numOwners: c.ownerCount ?? 0,
      totalSupply: c.tokenCount ?? 0,
      marketCap: (c.floorAsk?.price?.amount?.native ?? 0) * (c.tokenCount ?? 0),
      imageUrl: c.image ?? null,
      source: 'reservoir',
      timestamp: new Date().toISOString(),
    }));

    const totalVolume24h = collections.reduce((s, c) => s + c.volume24h, 0);
    const totalSales24h = collections.reduce((s, c) => s + c.sales24h, 0);

    return {
      totalVolume24h,
      totalSales24h,
      volumeChange24h: 0,
      activeCollections: collections.length,
      topCollections: collections.slice(0, 20),
      byChain: aggregateByChain(collections),
      source: 'reservoir',
      timestamp: new Date().toISOString(),
    };
  },

  async healthCheck(): Promise<boolean> {
    try {
      const headers: Record<string, string> = {};
      if (RESERVOIR_API_KEY) headers['x-api-key'] = RESERVOIR_API_KEY;
      const res = await fetch(`${RESERVOIR_BASE}/collections/v7?limit=1`, {
        headers,
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch { return false; }
  },

  validate(data: NFTMarketData): boolean {
    return Array.isArray(data.topCollections);
  },
};

function aggregateByChain(collections: NFTCollection[]) {
  const map = new Map<string, { volume24h: number; sales24h: number }>();
  for (const c of collections) {
    const entry = map.get(c.chain) ?? { volume24h: 0, sales24h: 0 };
    entry.volume24h += c.volume24h;
    entry.sales24h += c.sales24h;
    map.set(c.chain, entry);
  }
  return Array.from(map.entries()).map(([chain, stats]) => ({ chain, ...stats }));
}
