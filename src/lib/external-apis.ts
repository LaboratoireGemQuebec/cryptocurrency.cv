/**
 * External APIs Integration
 *
 * Aggregates data from multiple free cryptocurrency APIs:
 * - CoinCap (https://coincap.io)
 * - CoinPaprika (https://coinpaprika.com)
 * - CoinLore (https://coinlore.com)
 *
 * @module external-apis
 */

const COINCAP_BASE = 'https://api.coincap.io/v2';
const COINPAPRIKA_BASE = 'https://api.coinpaprika.com/v1';
const COINLORE_BASE = 'https://api.coinlore.net/api';

// Cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// =============================================================================
// COINCAP API
// =============================================================================

export interface CoinCapAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
}

export interface CoinCapHistoryPoint {
  priceUsd: string;
  time: number;
  date: string;
}

/**
 * Get a single asset from CoinCap
 */
export async function getCoinCapAsset(id: string): Promise<CoinCapAsset> {
  const cacheKey = `coincap-asset-${id}`;
  const cached = getCached<CoinCapAsset>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${COINCAP_BASE}/assets/${id}`);
  if (!response.ok) {
    throw new Error(`CoinCap API error: ${response.status}`);
  }

  const json = await response.json();
  setCache(cacheKey, json.data);
  return json.data;
}

/**
 * Get multiple assets from CoinCap
 */
export async function getCoinCapAssets(limit = 100): Promise<CoinCapAsset[]> {
  const cacheKey = `coincap-assets-${limit}`;
  const cached = getCached<CoinCapAsset[]>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${COINCAP_BASE}/assets?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`CoinCap API error: ${response.status}`);
  }

  const json = await response.json();
  setCache(cacheKey, json.data);
  return json.data;
}

/**
 * Get price history for an asset from CoinCap
 */
export async function getCoinCapHistory(
  id: string,
  interval: 'm1' | 'm5' | 'm15' | 'm30' | 'h1' | 'h2' | 'h6' | 'h12' | 'd1' = 'h1'
): Promise<CoinCapHistoryPoint[]> {
  const cacheKey = `coincap-history-${id}-${interval}`;
  const cached = getCached<CoinCapHistoryPoint[]>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${COINCAP_BASE}/assets/${id}/history?interval=${interval}`);
  if (!response.ok) {
    throw new Error(`CoinCap API error: ${response.status}`);
  }

  const json = await response.json();
  setCache(cacheKey, json.data);
  return json.data;
}

// =============================================================================
// COINPAPRIKA API
// =============================================================================

export interface CoinPaprikaGlobal {
  market_cap_usd: number;
  volume_24h_usd: number;
  bitcoin_dominance_percentage: number;
  cryptocurrencies_number: number;
  market_cap_ath_value: number;
  market_cap_ath_date: string;
  volume_24h_ath_value: number;
  volume_24h_ath_date: string;
  market_cap_change_24h: number;
  volume_24h_change_24h: number;
  last_updated: number;
}

/**
 * Get global market data from CoinPaprika
 */
export async function getCoinPaprikaGlobal(): Promise<CoinPaprikaGlobal> {
  const cacheKey = 'coinpaprika-global';
  const cached = getCached<CoinPaprikaGlobal>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${COINPAPRIKA_BASE}/global`);
  if (!response.ok) {
    throw new Error(`CoinPaprika API error: ${response.status}`);
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

// =============================================================================
// COINLORE API
// =============================================================================

export interface CoinLoreGlobal {
  coins_count: number;
  active_markets: number;
  total_mcap: number;
  total_volume: number;
  btc_d: string;
  eth_d: string;
  mcap_change: string;
  volume_change: string;
  avg_change_percent: string;
  volume_ath: number;
  mcap_ath: number;
}

/**
 * Get global market data from CoinLore
 */
export async function getCoinLoreGlobal(): Promise<CoinLoreGlobal> {
  const cacheKey = 'coinlore-global';
  const cached = getCached<CoinLoreGlobal>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${COINLORE_BASE}/global/`);
  if (!response.ok) {
    throw new Error(`CoinLore API error: ${response.status}`);
  }

  const data = await response.json();
  const globalData = Array.isArray(data) ? data[0] : data;
  setCache(cacheKey, globalData);
  return globalData;
}

// =============================================================================
// AGGREGATED DATA
// =============================================================================

export interface AggregatedGlobalData {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  ethDominance: number;
  totalCoins: number;
  totalExchanges: number;
  marketCapChange24h: number;
  sources: string[];
  lastUpdated: string;
}

/**
 * Get aggregated global market data from multiple sources
 */
export async function getAggregatedGlobalData(): Promise<AggregatedGlobalData> {
  const cacheKey = 'aggregated-global';
  const cached = getCached<AggregatedGlobalData>(cacheKey);
  if (cached) return cached;

  try {
    // Fetch from multiple sources in parallel
    const [paprikaData, coinloreData] = await Promise.allSettled([
      getCoinPaprikaGlobal(),
      getCoinLoreGlobal(),
    ]);

    // Use CoinPaprika as primary, CoinLore as fallback
    let totalMarketCap = 0;
    let totalVolume24h = 0;
    let btcDominance = 0;
    let ethDominance = 0;
    let totalCoins = 0;
    let totalExchanges = 0;
    let marketCapChange24h = 0;
    const sources: string[] = [];

    if (paprikaData.status === 'fulfilled') {
      const data = paprikaData.value;
      totalMarketCap = data.market_cap_usd;
      totalVolume24h = data.volume_24h_usd;
      btcDominance = data.bitcoin_dominance_percentage;
      totalCoins = data.cryptocurrencies_number;
      marketCapChange24h = data.market_cap_change_24h;
      sources.push('coinpaprika');
    }

    if (coinloreData.status === 'fulfilled') {
      const data = coinloreData.value;
      if (!totalMarketCap) totalMarketCap = data.total_mcap;
      if (!totalVolume24h) totalVolume24h = data.total_volume;
      if (!btcDominance) btcDominance = parseFloat(data.btc_d);
      ethDominance = parseFloat(data.eth_d);
      if (!totalCoins) totalCoins = data.coins_count;
      totalExchanges = data.active_markets;
      if (!marketCapChange24h) marketCapChange24h = parseFloat(data.mcap_change);
      sources.push('coinlore');
    }

    const result: AggregatedGlobalData = {
      totalMarketCap,
      totalVolume24h,
      btcDominance,
      ethDominance,
      totalCoins,
      totalExchanges,
      marketCapChange24h,
      sources,
      lastUpdated: new Date().toISOString(),
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching aggregated global data:', error);
    throw error;
  }
}

export interface AggregatedAsset {
  id: string;
  symbol: string;
  name: string;
  rank: number;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  supply: number;
  maxSupply: number | null;
  sources: string[];
}

/**
 * Get aggregated assets from multiple sources
 */
export async function getAggregatedAssets(limit = 100): Promise<AggregatedAsset[]> {
  const cacheKey = `aggregated-assets-${limit}`;
  const cached = getCached<AggregatedAsset[]>(cacheKey);
  if (cached) return cached;

  try {
    const assets = await getCoinCapAssets(limit);

    const result = assets.map((asset) => ({
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      rank: parseInt(asset.rank, 10),
      price: parseFloat(asset.priceUsd),
      marketCap: parseFloat(asset.marketCapUsd),
      volume24h: parseFloat(asset.volumeUsd24Hr),
      change24h: parseFloat(asset.changePercent24Hr),
      supply: parseFloat(asset.supply),
      maxSupply: asset.maxSupply ? parseFloat(asset.maxSupply) : null,
      sources: ['coincap'],
    }));

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching aggregated assets:', error);
    throw error;
  }
}
