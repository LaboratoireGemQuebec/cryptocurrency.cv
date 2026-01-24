/**
 * Funding Rates Service
 * 
 * Aggregates perpetual futures funding rates from multiple exchanges.
 * Provides real-time rates, historical data, and arbitrage opportunities.
 */

// Types
export interface FundingRate {
  exchange: string;
  symbol: string;
  rate: number;
  nextFundingTime: Date;
  predictedRate?: number;
  markPrice: number;
  indexPrice: number;
  openInterest: number;
  volume24h: number;
  timestamp: Date;
}

export interface FundingHistory {
  symbol: string;
  exchange: string;
  rates: Array<{
    timestamp: Date;
    rate: number;
    markPrice: number;
  }>;
}

export interface FundingArbitrage {
  symbol: string;
  longExchange: string;
  shortExchange: string;
  longRate: number;
  shortRate: number;
  spread: number;
  annualizedReturn: number;
  risk: 'low' | 'medium' | 'high';
  requiredCapital: number;
  estimatedProfit24h: number;
}

export interface ExchangeConfig {
  name: string;
  displayName: string;
  logo: string;
  apiUrl: string;
  fundingInterval: number; // hours
  supportedPairs: string[];
}

// Supported exchanges
const EXCHANGES: Record<string, ExchangeConfig> = {
  binance: {
    name: 'binance',
    displayName: 'Binance',
    logo: '🟡',
    apiUrl: 'https://fapi.binance.com',
    fundingInterval: 8,
    supportedPairs: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT', 'LINKUSDT'],
  },
  bybit: {
    name: 'bybit',
    displayName: 'Bybit',
    logo: '🟠',
    apiUrl: 'https://api.bybit.com',
    fundingInterval: 8,
    supportedPairs: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT'],
  },
  okx: {
    name: 'okx',
    displayName: 'OKX',
    logo: '⚫',
    apiUrl: 'https://www.okx.com',
    fundingInterval: 8,
    supportedPairs: ['BTC-USDT-SWAP', 'ETH-USDT-SWAP', 'SOL-USDT-SWAP'],
  },
  dydx: {
    name: 'dydx',
    displayName: 'dYdX',
    logo: '🟣',
    apiUrl: 'https://api.dydx.exchange',
    fundingInterval: 1,
    supportedPairs: ['BTC-USD', 'ETH-USD', 'SOL-USD'],
  },
  hyperliquid: {
    name: 'hyperliquid',
    displayName: 'Hyperliquid',
    logo: '🔵',
    apiUrl: 'https://api.hyperliquid.xyz',
    fundingInterval: 1,
    supportedPairs: ['BTC', 'ETH', 'SOL', 'ARB', 'DOGE'],
  },
};

// Cache
const ratesCache = new Map<string, { data: FundingRate[]; expires: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute

/**
 * Fetch funding rates from Binance
 */
async function fetchBinanceFunding(): Promise<FundingRate[]> {
  try {
    const response = await fetch('https://fapi.binance.com/fapi/v1/premiumIndex');
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((item: Record<string, unknown>) => ({
      exchange: 'binance',
      symbol: normalizeSymbol(item.symbol as string),
      rate: parseFloat(item.lastFundingRate as string) * 100,
      nextFundingTime: new Date(item.nextFundingTime as number),
      predictedRate: parseFloat(item.interestRate as string) * 100,
      markPrice: parseFloat(item.markPrice as string),
      indexPrice: parseFloat(item.indexPrice as string),
      openInterest: 0,
      volume24h: 0,
      timestamp: new Date(item.time as number),
    }));
  } catch (error) {
    console.error('Binance funding fetch error:', error);
    return [];
  }
}

/**
 * Fetch funding rates from Bybit
 */
async function fetchBybitFunding(): Promise<FundingRate[]> {
  try {
    const response = await fetch('https://api.bybit.com/v5/market/tickers?category=linear');
    
    if (!response.ok) {
      throw new Error(`Bybit API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.retCode !== 0) {
      throw new Error(data.retMsg);
    }
    
    return data.result.list
      .filter((item: Record<string, unknown>) => (item.symbol as string).endsWith('USDT'))
      .map((item: Record<string, unknown>) => ({
        exchange: 'bybit',
        symbol: normalizeSymbol(item.symbol as string),
        rate: parseFloat(item.fundingRate as string) * 100,
        nextFundingTime: new Date(parseInt(item.nextFundingTime as string)),
        markPrice: parseFloat(item.markPrice as string),
        indexPrice: parseFloat(item.indexPrice as string),
        openInterest: parseFloat(item.openInterest as string),
        volume24h: parseFloat(item.turnover24h as string),
        timestamp: new Date(),
      }));
  } catch (error) {
    console.error('Bybit funding fetch error:', error);
    return [];
  }
}

/**
 * Fetch funding rates from OKX
 */
async function fetchOKXFunding(): Promise<FundingRate[]> {
  try {
    const symbols = ['BTC-USDT-SWAP', 'ETH-USDT-SWAP', 'SOL-USDT-SWAP', 'DOGE-USDT-SWAP', 'XRP-USDT-SWAP'];
    const rates: FundingRate[] = [];
    
    for (const symbol of symbols) {
      const response = await fetch(`https://www.okx.com/api/v5/public/funding-rate?instId=${symbol}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data[0]) {
          const item = data.data[0];
          rates.push({
            exchange: 'okx',
            symbol: normalizeSymbol(symbol),
            rate: parseFloat(item.fundingRate) * 100,
            nextFundingTime: new Date(parseInt(item.nextFundingTime)),
            markPrice: 0,
            indexPrice: 0,
            openInterest: 0,
            volume24h: 0,
            timestamp: new Date(parseInt(item.fundingTime)),
          });
        }
      }
    }
    
    return rates;
  } catch (error) {
    console.error('OKX funding fetch error:', error);
    return [];
  }
}

/**
 * Generate mock data for development
 */
function generateMockFundingRates(): FundingRate[] {
  const symbols = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'DOT', 'LINK', 'MATIC'];
  const exchanges = ['binance', 'bybit', 'okx', 'dydx', 'hyperliquid'];
  const rates: FundingRate[] = [];
  
  const basePrices: Record<string, number> = {
    BTC: 98500,
    ETH: 3850,
    SOL: 185,
    XRP: 2.45,
    DOGE: 0.38,
    ADA: 0.92,
    AVAX: 42,
    DOT: 8.5,
    LINK: 24,
    MATIC: 0.55,
  };
  
  for (const symbol of symbols) {
    for (const exchange of exchanges) {
      // Generate realistic funding rate (-0.1% to +0.1% typical)
      const baseRate = (Math.random() - 0.5) * 0.2;
      const exchangeVariance = (Math.random() - 0.5) * 0.02;
      const rate = baseRate + exchangeVariance;
      
      const basePrice = basePrices[symbol] || 100;
      const priceVariance = basePrice * (Math.random() - 0.5) * 0.001;
      
      const nextFundingHours = Math.floor(Math.random() * 8);
      
      rates.push({
        exchange,
        symbol,
        rate: Math.round(rate * 10000) / 10000,
        nextFundingTime: new Date(Date.now() + nextFundingHours * 60 * 60 * 1000),
        predictedRate: rate + (Math.random() - 0.5) * 0.01,
        markPrice: basePrice + priceVariance,
        indexPrice: basePrice,
        openInterest: Math.random() * 1000000000,
        volume24h: Math.random() * 500000000,
        timestamp: new Date(),
      });
    }
  }
  
  return rates;
}

/**
 * Normalize symbol across exchanges
 */
function normalizeSymbol(symbol: string): string {
  return symbol
    .replace(/USDT$/, '')
    .replace(/-USDT-SWAP$/, '')
    .replace(/-USDT$/, '')
    .replace(/-USD$/, '')
    .toUpperCase();
}

/**
 * Get all funding rates from all exchanges
 */
export async function getAllFundingRates(): Promise<FundingRate[]> {
  const cacheKey = 'all_funding_rates';
  const cached = ratesCache.get(cacheKey);
  
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  
  // In production, fetch from real APIs
  // For development, use mock data
  const useRealData = process.env.NODE_ENV === 'production';
  
  let rates: FundingRate[];
  
  if (useRealData) {
    const [binance, bybit, okx] = await Promise.all([
      fetchBinanceFunding(),
      fetchBybitFunding(),
      fetchOKXFunding(),
    ]);
    
    rates = [...binance, ...bybit, ...okx];
    
    // If no data from real APIs, fall back to mock
    if (rates.length === 0) {
      rates = generateMockFundingRates();
    }
  } else {
    rates = generateMockFundingRates();
  }
  
  ratesCache.set(cacheKey, {
    data: rates,
    expires: Date.now() + CACHE_TTL,
  });
  
  return rates;
}

/**
 * Get funding rates for a specific symbol
 */
export async function getFundingRatesForSymbol(symbol: string): Promise<FundingRate[]> {
  const allRates = await getAllFundingRates();
  return allRates.filter(r => r.symbol === symbol.toUpperCase());
}

/**
 * Get funding rates for a specific exchange
 */
export async function getFundingRatesForExchange(exchange: string): Promise<FundingRate[]> {
  const allRates = await getAllFundingRates();
  return allRates.filter(r => r.exchange === exchange.toLowerCase());
}

/**
 * Find funding rate arbitrage opportunities
 */
export async function getFundingArbitrage(minSpread = 0.01): Promise<FundingArbitrage[]> {
  const allRates = await getAllFundingRates();
  const arbitrageOpportunities: FundingArbitrage[] = [];
  
  // Group by symbol
  const bySymbol = new Map<string, FundingRate[]>();
  for (const rate of allRates) {
    const existing = bySymbol.get(rate.symbol) || [];
    existing.push(rate);
    bySymbol.set(rate.symbol, existing);
  }
  
  // Find arbitrage opportunities
  for (const [symbol, rates] of bySymbol) {
    if (rates.length < 2) continue;
    
    // Sort by rate
    rates.sort((a, b) => a.rate - b.rate);
    
    const lowestRate = rates[0];
    const highestRate = rates[rates.length - 1];
    const spread = highestRate.rate - lowestRate.rate;
    
    if (spread >= minSpread) {
      // Calculate annualized return (8-hour funding = 3x daily = 1095x yearly)
      const fundingPeriodsPerYear = 365 * 3;
      const annualizedReturn = spread * fundingPeriodsPerYear;
      
      // Estimate required capital based on mark price
      const avgPrice = (lowestRate.markPrice + highestRate.markPrice) / 2;
      const requiredCapital = avgPrice * 2; // Long + Short position
      
      // Daily profit estimate
      const estimatedProfit24h = (spread / 100) * requiredCapital * 3;
      
      // Risk assessment
      let risk: 'low' | 'medium' | 'high' = 'medium';
      if (spread > 0.1) risk = 'high';
      else if (spread < 0.03) risk = 'low';
      
      arbitrageOpportunities.push({
        symbol,
        longExchange: lowestRate.exchange,
        shortExchange: highestRate.exchange,
        longRate: lowestRate.rate,
        shortRate: highestRate.rate,
        spread,
        annualizedReturn,
        risk,
        requiredCapital,
        estimatedProfit24h,
      });
    }
  }
  
  // Sort by spread (highest first)
  return arbitrageOpportunities.sort((a, b) => b.spread - a.spread);
}

/**
 * Get funding rate statistics
 */
export async function getFundingStats(): Promise<{
  totalPairs: number;
  avgRate: number;
  bullishPairs: number;
  bearishPairs: number;
  highestRate: FundingRate | null;
  lowestRate: FundingRate | null;
  topArbitrage: FundingArbitrage[];
}> {
  const allRates = await getAllFundingRates();
  const arbitrage = await getFundingArbitrage(0.01);
  
  // Dedupe by symbol (take average across exchanges)
  const bySymbol = new Map<string, number[]>();
  for (const rate of allRates) {
    const existing = bySymbol.get(rate.symbol) || [];
    existing.push(rate.rate);
    bySymbol.set(rate.symbol, existing);
  }
  
  const avgRates = Array.from(bySymbol.entries()).map(([symbol, rates]) => ({
    symbol,
    avgRate: rates.reduce((a, b) => a + b, 0) / rates.length,
  }));
  
  const bullishPairs = avgRates.filter(r => r.avgRate > 0.01).length;
  const bearishPairs = avgRates.filter(r => r.avgRate < -0.01).length;
  const avgRate = avgRates.reduce((sum, r) => sum + r.avgRate, 0) / avgRates.length;
  
  // Find extreme rates
  const sortedRates = [...allRates].sort((a, b) => b.rate - a.rate);
  
  return {
    totalPairs: bySymbol.size,
    avgRate,
    bullishPairs,
    bearishPairs,
    highestRate: sortedRates[0] || null,
    lowestRate: sortedRates[sortedRates.length - 1] || null,
    topArbitrage: arbitrage.slice(0, 5),
  };
}

/**
 * Get historical funding rates (mock data)
 */
export async function getFundingHistory(
  symbol: string,
  exchange: string,
  days = 7
): Promise<FundingHistory> {
  const history: Array<{ timestamp: Date; rate: number; markPrice: number }> = [];
  const now = Date.now();
  const hoursBack = days * 24;
  const intervalsPerDay = 3; // 8-hour funding
  
  // Generate mock historical data
  let baseRate = (Math.random() - 0.5) * 0.1;
  const basePrice = 50000 + Math.random() * 50000;
  
  for (let i = hoursBack; i >= 0; i -= 8) {
    // Random walk for rate
    baseRate += (Math.random() - 0.5) * 0.02;
    baseRate = Math.max(-0.5, Math.min(0.5, baseRate));
    
    const priceVariance = (Math.random() - 0.5) * basePrice * 0.02;
    
    history.push({
      timestamp: new Date(now - i * 60 * 60 * 1000),
      rate: Math.round(baseRate * 10000) / 10000,
      markPrice: basePrice + priceVariance,
    });
  }
  
  return {
    symbol,
    exchange,
    rates: history,
  };
}

export { EXCHANGES };
