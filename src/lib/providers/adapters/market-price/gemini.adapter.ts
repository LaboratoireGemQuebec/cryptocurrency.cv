/**
 * Gemini Market Price Adapter
 *
 * Gemini is a US-regulated, security-focused exchange:
 * - 100+ trading pairs
 * - No API key for public endpoints
 *
 * @module providers/adapters/market-price/gemini
 */

import type { DataProvider, FetchParams, RateLimitConfig } from '../../types';
import type { MarketPrice } from './coingecko.adapter';

const BASE = 'https://api.gemini.com/v1';

const RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 1_000,
};

const PAIRS: Record<string, string> = {
  BTC: 'btcusd', ETH: 'ethusd', SOL: 'solusd', DOGE: 'dogeusd',
  LINK: 'linkusd', AVAX: 'avaxusd', UNI: 'uniusd', AAVE: 'aaveusd',
  LTC: 'ltcusd', DOT: 'dotusd', MATIC: 'maticusd', ADA: 'adausd',
};

export const geminiAdapter: DataProvider<MarketPrice[]> = {
  name: 'gemini',
  description: 'Gemini — US-regulated, security-focused exchange',
  priority: 9,
  weight: 0.15,
  rateLimit: RATE_LIMIT,
  capabilities: ['market-price'],

  async fetch(params: FetchParams): Promise<MarketPrice[]> {
    const symbols = params.symbols?.map((s) => s.toUpperCase()) ?? Object.keys(PAIRS).slice(0, 10);
    const pairsToFetch = symbols.map((s) => PAIRS[s]).filter(Boolean);
    const now = new Date().toISOString();

    const results = await Promise.allSettled(
      pairsToFetch.map(async (pair): Promise<MarketPrice> => {
        const res = await fetch(`${BASE}/pubticker/${pair}`);
        if (!res.ok) throw new Error(`Gemini ${pair}: ${res.status}`);

        const ticker: GeminiTicker = await res.json();
        const symbol = pair.replace(/usd$/, '').toUpperCase();
        const price = parseFloat(ticker.last) || 0;
        const open = parseFloat(ticker.open) || price;

        return {
          id: symbol.toLowerCase(),
          symbol,
          name: symbol,
          current_price: price,
          market_cap: 0,
          total_volume: parseFloat(ticker.volume?.USD ?? '0') || 0,
          price_change_24h: price - open,
          price_change_percentage_24h: open > 0 ? ((price - open) / open) * 100 : 0,
          high_24h: parseFloat(ticker.high) || 0,
          low_24h: parseFloat(ticker.low) || 0,
          last_updated: now,
          source: 'gemini',
        };
      }),
    );

    return results
      .filter((r): r is PromiseFulfilledResult<MarketPrice> => r.status === 'fulfilled')
      .map((r) => r.value);
  },

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${BASE}/pubticker/btcusd`, { signal: AbortSignal.timeout(5000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  validate(data: MarketPrice[]): boolean {
    if (!Array.isArray(data) || data.length === 0) return false;
    return data.every((d) => typeof d.current_price === 'number' && d.current_price > 0);
  },
};

interface GeminiTicker {
  last: string;
  bid: string;
  ask: string;
  open: string;
  high: string;
  low: string;
  volume: Record<string, string>;
}
