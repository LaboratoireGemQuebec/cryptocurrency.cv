/**
 * Footprint Analytics Adapter — On-chain gaming analytics
 *
 * @see https://docs.footprint.network/
 * @module providers/adapters/gaming-data/footprint
 */

import type { DataProvider, FetchParams, RateLimitConfig } from '../../types';
import type { GamingData, GameData } from './types';

const FP_BASE = 'https://api.footprint.network/api/v1';
const FP_API_KEY = process.env.FOOTPRINT_API_KEY ?? '';

const RATE_LIMIT: RateLimitConfig = { maxRequests: 20, windowMs: 60_000 };

export const footprintAdapter: DataProvider<GamingData> = {
  name: 'footprint',
  description: 'Footprint Analytics — on-chain gaming data',
  priority: 2,
  weight: 0.40,
  rateLimit: RATE_LIMIT,
  capabilities: ['gaming-data'],

  async fetch(params: FetchParams): Promise<GamingData> {
    if (!FP_API_KEY) throw new Error('FOOTPRINT_API_KEY not configured');

    const limit = params.limit ?? 25;
    const url = `${FP_BASE}/protocol/ranking/GameFi?limit=${Math.min(limit, 50)}&sort=-active_addresses_24h`;

    const res = await fetch(url, {
      headers: { 'API-KEY': FP_API_KEY, Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`Footprint HTTP ${res.status}`);
    const json = await res.json();

     
    const games: GameData[] = (json.data ?? []).map((d: any) => ({
      id: d.protocol_slug ?? d.protocol_name ?? '',
      name: d.protocol_name ?? '',
      chain: d.chain ?? 'multi',
      dau: d.active_addresses_24h ?? 0,
      transactions24h: d.transactions_24h ?? 0,
      volume24h: d.volume_24h ?? 0,
      volumeChange24h: d.volume_change_24h ?? 0,
      category: 'game',
      balance: d.tvl ?? 0,
      imageUrl: d.logo ?? null,
      source: 'footprint',
      timestamp: new Date().toISOString(),
    }));

    return {
      totalDau: games.reduce((s, g) => s + g.dau, 0),
      totalTransactions24h: games.reduce((s, g) => s + g.transactions24h, 0),
      totalVolume24h: games.reduce((s, g) => s + g.volume24h, 0),
      games: games.slice(0, 25),
      byChain: [],
      source: 'footprint',
      timestamp: new Date().toISOString(),
    };
  },

  async healthCheck(): Promise<boolean> {
    if (!FP_API_KEY) return false;
    try {
      const res = await fetch(`${FP_BASE}/protocol/ranking/GameFi?limit=1`, {
        headers: { 'API-KEY': FP_API_KEY },
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch { return false; }
  },

  validate(data: GamingData): boolean {
    return Array.isArray(data.games);
  },
};
