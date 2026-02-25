/**
 * OpenSea Adapter — Primary NFT marketplace data
 *
 * Uses the OpenSea API v2:
 * - Collection stats (floor price, volume, owners)
 * - Top collections by volume
 * - Multi-chain: ETH, Polygon, Base, Arbitrum
 *
 * @see https://docs.opensea.io/reference/api-overview
 * @module providers/adapters/nft-market/opensea
 */

import type { DataProvider, FetchParams, RateLimitConfig } from '../../types';
import type { NFTMarketData, NFTCollection } from './types';

const OPENSEA_BASE = 'https://api.opensea.io/api/v2';
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY ?? '';

const RATE_LIMIT: RateLimitConfig = { maxRequests: OPENSEA_API_KEY ? 40 : 4, windowMs: 60_000 };

export const openseaAdapter: DataProvider<NFTMarketData> = {
  name: 'opensea',
  description: 'OpenSea API v2 — largest NFT marketplace',
  priority: 1,
  weight: 0.50,
  rateLimit: RATE_LIMIT,
  capabilities: ['nft-market'],

  async fetch(params: FetchParams): Promise<NFTMarketData> {
    const limit = params.limit ?? 20;
    const chain = params.chain ?? 'ethereum';

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (OPENSEA_API_KEY) headers['X-API-KEY'] = OPENSEA_API_KEY;

    // Fetch top collections by volume
    const url = `${OPENSEA_BASE}/collections?chain=${chain}&limit=${Math.min(limit, 50)}&order_by=seven_day_volume`;
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });

    if (res.status === 429) throw new Error('OpenSea rate limit (429)');
    if (!res.ok) throw new Error(`OpenSea HTTP ${res.status}`);

    const json = await res.json();
    const collections: NFTCollection[] = (json.collections ?? []).map(
       
      (c: any) => ({
        slug: c.collection ?? c.slug ?? '',
        name: c.name ?? '',
        chain,
        floorPrice: c.stats?.floor_price ?? 0,
        floorPriceCurrency: 'ETH',
        volume24h: c.stats?.one_day_volume ?? 0,
        volumeChange24h: c.stats?.one_day_change ?? 0,
        sales24h: c.stats?.one_day_sales ?? 0,
        numOwners: c.stats?.num_owners ?? 0,
        totalSupply: c.stats?.total_supply ?? 0,
        marketCap: (c.stats?.floor_price ?? 0) * (c.stats?.total_supply ?? 0),
        imageUrl: c.image_url ?? null,
        source: 'opensea',
        timestamp: new Date().toISOString(),
      }),
    );

    const totalVolume24h = collections.reduce((s, c) => s + c.volume24h, 0);
    const totalSales24h = collections.reduce((s, c) => s + c.sales24h, 0);

    return {
      totalVolume24h,
      totalSales24h,
      volumeChange24h: 0,
      activeCollections: collections.length,
      topCollections: collections.slice(0, 20),
      byChain: [{ chain, volume24h: totalVolume24h, sales24h: totalSales24h }],
      source: 'opensea',
      timestamp: new Date().toISOString(),
    };
  },

  async healthCheck(): Promise<boolean> {
    try {
      const headers: Record<string, string> = {};
      if (OPENSEA_API_KEY) headers['X-API-KEY'] = OPENSEA_API_KEY;
      const res = await fetch(`${OPENSEA_BASE}/collections?limit=1`, {
        headers,
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch { return false; }
  },

  validate(data: NFTMarketData): boolean {
    return Array.isArray(data.topCollections) && data.topCollections.length > 0;
  },
};
