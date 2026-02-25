/**
 * SimpleHash Adapter — Multi-chain NFT data (ETH, Solana, Polygon, Base)
 *
 * Free tier: 1000 req/day. Covers 80+ chains.
 *
 * @see https://docs.simplehash.com/reference
 * @module providers/adapters/nft-market/simplehash
 */

import type { DataProvider, FetchParams, RateLimitConfig } from '../../types';
import type { NFTMarketData, NFTCollection } from './types';

const SH_BASE = 'https://api.simplehash.com/api/v0';
const SH_API_KEY = process.env.SIMPLEHASH_API_KEY ?? '';

const RATE_LIMIT: RateLimitConfig = { maxRequests: 10, windowMs: 60_000 };

export const simplehashAdapter: DataProvider<NFTMarketData> = {
  name: 'simplehash',
  description: 'SimpleHash — multi-chain NFT data (80+ chains)',
  priority: 3,
  weight: 0.20,
  rateLimit: RATE_LIMIT,
  capabilities: ['nft-market'],

  async fetch(params: FetchParams): Promise<NFTMarketData> {
    if (!SH_API_KEY) throw new Error('SIMPLEHASH_API_KEY not configured');

    const limit = params.limit ?? 20;
    const chains = params.chain ?? 'ethereum';

    const url = `${SH_BASE}/nfts/collections/top_v2?chains=${chains}&time_period=24h&limit=${Math.min(limit, 50)}`;
    const res = await fetch(url, {
      headers: { 'X-API-KEY': SH_API_KEY, Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`SimpleHash HTTP ${res.status}`);
    const json = await res.json();

     
    const collections: NFTCollection[] = (json.collections ?? []).map((c: any) => ({
      slug: c.collection_id ?? '',
      name: c.name ?? '',
      chain: c.chain ?? chains,
      floorPrice: c.floor_prices?.[0]?.value_usd_cents ? c.floor_prices[0].value_usd_cents / 100 : 0,
      floorPriceCurrency: 'USD',
      volume24h: c.volume_usd_cents_24h ? c.volume_usd_cents_24h / 100 : 0,
      volumeChange24h: 0,
      sales24h: c.sales_24h ?? 0,
      numOwners: c.distinct_owner_count ?? 0,
      totalSupply: c.total_quantity ?? 0,
      marketCap: c.market_cap_usd_cents ? c.market_cap_usd_cents / 100 : 0,
      imageUrl: c.image_url ?? null,
      source: 'simplehash',
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
      byChain: [],
      source: 'simplehash',
      timestamp: new Date().toISOString(),
    };
  },

  async healthCheck(): Promise<boolean> {
    if (!SH_API_KEY) return false;
    try {
      const res = await fetch(`${SH_BASE}/nfts/collections/top_v2?chains=ethereum&limit=1`, {
        headers: { 'X-API-KEY': SH_API_KEY },
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch { return false; }
  },

  validate(data: NFTMarketData): boolean {
    return Array.isArray(data.topCollections);
  },
};
