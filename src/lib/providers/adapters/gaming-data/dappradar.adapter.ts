/**
 * DappRadar Adapter — Gaming & dApp analytics
 *
 * @see https://dappradar.com/api
 * @module providers/adapters/gaming-data/dappradar
 */

import type { DataProvider, FetchParams, RateLimitConfig } from '../../types';
import type { GamingData, GameData } from './types';

const DR_BASE = 'https://apis.dappradar.com/v2';
const DR_API_KEY = process.env.DAPPRADAR_API_KEY ?? '';

const RATE_LIMIT: RateLimitConfig = { maxRequests: 30, windowMs: 60_000 };

export const dappradarAdapter: DataProvider<GamingData> = {
  name: 'dappradar',
  description: 'DappRadar — blockchain gaming analytics',
  priority: 1,
  weight: 0.60,
  rateLimit: RATE_LIMIT,
  capabilities: ['gaming-data'],

  async fetch(params: FetchParams): Promise<GamingData> {
    if (!DR_API_KEY) throw new Error('DAPPRADAR_API_KEY not configured');

    const limit = params.limit ?? 25;
    const url = `${DR_BASE}/dapps?category=games&range=24h&sort=users&order=desc&resultsPerPage=${Math.min(limit, 50)}`;

    const res = await fetch(url, {
      headers: { 'X-BLOBR-KEY': DR_API_KEY, Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`DappRadar HTTP ${res.status}`);
    const json = await res.json();

     
    const games: GameData[] = (json.results ?? json.dapps ?? []).map((d: any) => ({
      id: d.dappId?.toString() ?? d.slug ?? '',
      name: d.name ?? '',
      chain: d.chains?.[0] ?? d.chain ?? 'unknown',
      dau: d.statistic?.userActivity ?? d.metrics?.uaw ?? 0,
      transactions24h: d.statistic?.transactions ?? d.metrics?.transactions ?? 0,
      volume24h: d.statistic?.volume ?? d.metrics?.volume ?? 0,
      volumeChange24h: d.statistic?.volumeChangePercentage ?? 0,
      category: d.category ?? 'game',
      balance: d.statistic?.balance ?? d.metrics?.balance ?? 0,
      imageUrl: d.logo ?? d.icon ?? null,
      source: 'dappradar',
      timestamp: new Date().toISOString(),
    }));

    const totalDau = games.reduce((s, g) => s + g.dau, 0);
    const totalTx = games.reduce((s, g) => s + g.transactions24h, 0);
    const totalVol = games.reduce((s, g) => s + g.volume24h, 0);

    return {
      totalDau,
      totalTransactions24h: totalTx,
      totalVolume24h: totalVol,
      games: games.slice(0, 25),
      byChain: aggregateByChain(games),
      source: 'dappradar',
      timestamp: new Date().toISOString(),
    };
  },

  async healthCheck(): Promise<boolean> {
    if (!DR_API_KEY) return false;
    try {
      const res = await fetch(`${DR_BASE}/dapps?category=games&resultsPerPage=1`, {
        headers: { 'X-BLOBR-KEY': DR_API_KEY },
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch { return false; }
  },

  validate(data: GamingData): boolean {
    return Array.isArray(data.games);
  },
};

function aggregateByChain(games: GameData[]) {
  const map = new Map<string, { dau: number; volume24h: number }>();
  for (const g of games) {
    const entry = map.get(g.chain) ?? { dau: 0, volume24h: 0 };
    entry.dau += g.dau;
    entry.volume24h += g.volume24h;
    map.set(g.chain, entry);
  }
  return Array.from(map.entries()).map(([chain, s]) => ({ chain, ...s }));
}
