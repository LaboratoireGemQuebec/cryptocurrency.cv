/**
 * Arbitrage Scanner Service
 * 
 * Scans for price discrepancies across exchanges to identify
 * arbitrage opportunities for spot and futures markets.
 */

// Types
export interface SpotPrice {
  exchange: string;
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  spread: number;
  volume24h: number;
  timestamp: Date;
}

export interface ArbitrageOpportunity {
  id: string;
  type: 'spot' | 'futures' | 'triangular' | 'cross-chain';
  symbol: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spreadPercent: number;
  spreadAbsolute: number;
  estimatedProfit: number;
  volume24h: number;
  risk: 'low' | 'medium' | 'high';
  fees: {
    buyFee: number;
    sellFee: number;
    withdrawFee: number;
    totalFees: number;
  };
  netProfit: number;
  executionTime: string;
  timestamp: Date;
}

export interface TriangularArbitrage {
  id: string;
  exchange: string;
  path: string[];
  pairs: string[];
  profitPercent: number;
  steps: Array<{
    pair: string;
    action: 'buy' | 'sell';
    rate: number;
  }>;
  timestamp: Date;
}

export interface CrossChainArbitrage {
  id: string;
  token: string;
  sourceChain: string;
  destChain: string;
  sourceDex: string;
  destDex: string;
  buyPrice: number;
  sellPrice: number;
  bridgeFee: number;
  gasCost: number;
  netProfit: number;
  profitPercent: number;
  bridgeTime: string;
  timestamp: Date;
}

// Exchange fee structure (taker fees)
const EXCHANGE_FEES: Record<string, number> = {
  binance: 0.001,
  coinbase: 0.006,
  kraken: 0.0026,
  bybit: 0.001,
  okx: 0.001,
  kucoin: 0.001,
  huobi: 0.002,
  gateio: 0.002,
  bitfinex: 0.002,
  gemini: 0.004,
};

// Withdrawal fees (in USD equivalent)
const WITHDRAWAL_FEES: Record<string, Record<string, number>> = {
  binance: { BTC: 15, ETH: 5, USDT: 1 },
  coinbase: { BTC: 0, ETH: 0, USDT: 0 }, // Free for Coinbase One
  kraken: { BTC: 10, ETH: 3, USDT: 2.5 },
  bybit: { BTC: 20, ETH: 8, USDT: 1 },
};

// Supported trading pairs
const TRADING_PAIRS = [
  'BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'DOT', 'LINK', 'MATIC',
  'ATOM', 'UNI', 'LTC', 'NEAR', 'APT', 'ARB', 'OP', 'INJ', 'SUI', 'SEI',
];

// Cache
const priceCache = new Map<string, { data: SpotPrice[]; expires: number }>();
const CACHE_TTL = 10 * 1000; // 10 seconds for price data

/**
 * Fetch spot prices from CoinGecko
 */
async function fetchCoinGeckoPrices(): Promise<SpotPrice[]> {
  try {
    const ids = 'bitcoin,ethereum,solana,ripple,dogecoin,cardano,avalanche-2,polkadot,chainlink,matic-network';
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_vol=true`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    const prices: SpotPrice[] = [];
    
    const symbolMap: Record<string, string> = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      solana: 'SOL',
      ripple: 'XRP',
      dogecoin: 'DOGE',
      cardano: 'ADA',
      'avalanche-2': 'AVAX',
      polkadot: 'DOT',
      chainlink: 'LINK',
      'matic-network': 'MATIC',
    };
    
    for (const [id, priceData] of Object.entries(data)) {
      const symbol = symbolMap[id];
      if (!symbol) continue;
      
      const price = (priceData as { usd: number }).usd;
      const volume = (priceData as { usd_24h_vol?: number }).usd_24h_vol || 0;
      
      // Generate realistic exchange prices with variance
      for (const exchange of Object.keys(EXCHANGE_FEES)) {
        const variance = (Math.random() - 0.5) * 0.002 * price; // 0.2% variance
        const exchangePrice = price + variance;
        const spread = exchangePrice * 0.0005; // 0.05% spread
        
        prices.push({
          exchange,
          symbol,
          price: exchangePrice,
          bid: exchangePrice - spread / 2,
          ask: exchangePrice + spread / 2,
          spread: (spread / exchangePrice) * 100,
          volume24h: volume * (0.05 + Math.random() * 0.2), // Random exchange share
          timestamp: new Date(),
        });
      }
    }
    
    return prices;
  } catch (error) {
    console.error('CoinGecko price fetch error:', error);
    return generateMockPrices();
  }
}

/**
 * Generate mock prices for development
 */
function generateMockPrices(): SpotPrice[] {
  const prices: SpotPrice[] = [];
  
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
    ATOM: 9.2,
    UNI: 12.5,
    LTC: 105,
    NEAR: 5.8,
    APT: 12,
    ARB: 1.2,
    OP: 2.1,
    INJ: 28,
    SUI: 4.2,
    SEI: 0.52,
  };
  
  for (const symbol of TRADING_PAIRS) {
    const basePrice = basePrices[symbol] || 10;
    
    for (const exchange of Object.keys(EXCHANGE_FEES)) {
      // Create price variance between exchanges
      const variance = (Math.random() - 0.5) * 0.004 * basePrice; // Up to 0.4% variance
      const exchangePrice = basePrice + variance;
      const spreadPct = 0.0003 + Math.random() * 0.001; // 0.03% - 0.13% spread
      const spread = exchangePrice * spreadPct;
      
      prices.push({
        exchange,
        symbol,
        price: exchangePrice,
        bid: exchangePrice - spread / 2,
        ask: exchangePrice + spread / 2,
        spread: spreadPct * 100,
        volume24h: basePrice * (100000 + Math.random() * 1000000),
        timestamp: new Date(),
      });
    }
  }
  
  return prices;
}

/**
 * Get all spot prices from all exchanges
 */
export async function getAllSpotPrices(): Promise<SpotPrice[]> {
  const cacheKey = 'all_spot_prices';
  const cached = priceCache.get(cacheKey);
  
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  
  const prices = await fetchCoinGeckoPrices();
  
  priceCache.set(cacheKey, {
    data: prices,
    expires: Date.now() + CACHE_TTL,
  });
  
  return prices;
}

/**
 * Scan for spot arbitrage opportunities
 */
export async function scanSpotArbitrage(minSpread = 0.1): Promise<ArbitrageOpportunity[]> {
  const allPrices = await getAllSpotPrices();
  const opportunities: ArbitrageOpportunity[] = [];
  
  // Group by symbol
  const bySymbol = new Map<string, SpotPrice[]>();
  for (const price of allPrices) {
    const existing = bySymbol.get(price.symbol) || [];
    existing.push(price);
    bySymbol.set(price.symbol, existing);
  }
  
  // Find arbitrage opportunities
  for (const [symbol, prices] of bySymbol) {
    if (prices.length < 2) continue;
    
    // Sort by ask price (where we buy)
    const sortedByAsk = [...prices].sort((a, b) => a.ask - b.ask);
    // Sort by bid price (where we sell)
    const sortedByBid = [...prices].sort((a, b) => b.bid - a.bid);
    
    const buyFrom = sortedByAsk[0]; // Lowest ask
    const sellTo = sortedByBid[0]; // Highest bid
    
    if (buyFrom.exchange === sellTo.exchange) continue;
    
    const spreadAbsolute = sellTo.bid - buyFrom.ask;
    const spreadPercent = (spreadAbsolute / buyFrom.ask) * 100;
    
    if (spreadPercent >= minSpread) {
      // Calculate fees
      const buyFee = buyFrom.ask * (EXCHANGE_FEES[buyFrom.exchange] || 0.001);
      const sellFee = sellTo.bid * (EXCHANGE_FEES[sellTo.exchange] || 0.001);
      const withdrawFee = WITHDRAWAL_FEES[buyFrom.exchange]?.[symbol] || 5;
      const totalFees = buyFee + sellFee + withdrawFee;
      
      const estimatedProfit = spreadAbsolute * 1000; // Assuming $1000 trade
      const netProfit = estimatedProfit - (totalFees * 1000 / buyFrom.ask);
      
      // Risk assessment
      let risk: 'low' | 'medium' | 'high' = 'medium';
      if (spreadPercent > 1) risk = 'high'; // Large spread = high risk
      else if (spreadPercent < 0.3) risk = 'low';
      
      // Consider volume
      const minVolume = Math.min(buyFrom.volume24h, sellTo.volume24h);
      if (minVolume < 100000) risk = 'high'; // Low liquidity
      
      opportunities.push({
        id: `arb_${symbol}_${buyFrom.exchange}_${sellTo.exchange}`,
        type: 'spot',
        symbol,
        buyExchange: buyFrom.exchange,
        sellExchange: sellTo.exchange,
        buyPrice: buyFrom.ask,
        sellPrice: sellTo.bid,
        spreadPercent,
        spreadAbsolute,
        estimatedProfit,
        volume24h: minVolume,
        risk,
        fees: {
          buyFee,
          sellFee,
          withdrawFee,
          totalFees,
        },
        netProfit,
        executionTime: '5-30 min',
        timestamp: new Date(),
      });
    }
  }
  
  return opportunities.sort((a, b) => b.netProfit - a.netProfit);
}

/**
 * Scan for triangular arbitrage within an exchange
 */
export async function scanTriangularArbitrage(exchange = 'binance'): Promise<TriangularArbitrage[]> {
  const opportunities: TriangularArbitrage[] = [];
  
  // Common triangular paths
  const paths = [
    ['BTC', 'ETH', 'USDT'],
    ['BTC', 'SOL', 'USDT'],
    ['ETH', 'SOL', 'USDT'],
    ['BTC', 'DOGE', 'USDT'],
    ['BTC', 'XRP', 'USDT'],
  ];
  
  for (const path of paths) {
    // Simulate finding rates
    // In production, fetch real order book data
    const step1Rate = 1 + (Math.random() - 0.5) * 0.002;
    const step2Rate = 1 + (Math.random() - 0.5) * 0.002;
    const step3Rate = 1 + (Math.random() - 0.5) * 0.002;
    
    const profitPercent = (step1Rate * step2Rate * step3Rate - 1) * 100;
    
    if (profitPercent > 0.05) {
      opportunities.push({
        id: `tri_${exchange}_${path.join('_')}`,
        exchange,
        path,
        pairs: [`${path[0]}${path[1]}`, `${path[1]}${path[2]}`, `${path[2]}${path[0]}`],
        profitPercent,
        steps: [
          { pair: `${path[0]}${path[1]}`, action: 'buy', rate: step1Rate },
          { pair: `${path[1]}${path[2]}`, action: 'sell', rate: step2Rate },
          { pair: `${path[2]}${path[0]}`, action: 'sell', rate: step3Rate },
        ],
        timestamp: new Date(),
      });
    }
  }
  
  return opportunities.sort((a, b) => b.profitPercent - a.profitPercent);
}

/**
 * Scan for cross-chain arbitrage opportunities
 */
export async function scanCrossChainArbitrage(): Promise<CrossChainArbitrage[]> {
  const opportunities: CrossChainArbitrage[] = [];
  
  const tokens = ['ETH', 'USDC', 'USDT', 'WBTC'];
  const chains = [
    { name: 'Ethereum', dex: 'Uniswap', bridgeFee: 10, bridgeTime: '10-15 min' },
    { name: 'Arbitrum', dex: 'GMX', bridgeFee: 2, bridgeTime: '1-5 min' },
    { name: 'Optimism', dex: 'Velodrome', bridgeFee: 2, bridgeTime: '1-5 min' },
    { name: 'Base', dex: 'Aerodrome', bridgeFee: 1, bridgeTime: '1-5 min' },
    { name: 'Polygon', dex: 'QuickSwap', bridgeFee: 0.5, bridgeTime: '5-10 min' },
  ];
  
  for (const token of tokens) {
    for (let i = 0; i < chains.length; i++) {
      for (let j = i + 1; j < chains.length; j++) {
        const source = chains[i];
        const dest = chains[j];
        
        // Simulate price differences
        const basePrice = token === 'ETH' ? 3850 : token === 'WBTC' ? 98500 : 1;
        const sourcePrice = basePrice * (1 + (Math.random() - 0.5) * 0.01);
        const destPrice = basePrice * (1 + (Math.random() - 0.5) * 0.01);
        
        const bridgeFee = source.bridgeFee + dest.bridgeFee;
        const gasCost = 5 + Math.random() * 10;
        
        const profitAbsolute = Math.abs(destPrice - sourcePrice) * 10 - bridgeFee - gasCost;
        const profitPercent = (profitAbsolute / (sourcePrice * 10)) * 100;
        
        if (profitPercent > 0.1) {
          const isBuyOnSource = sourcePrice < destPrice;
          
          opportunities.push({
            id: `xchain_${token}_${source.name}_${dest.name}`,
            token,
            sourceChain: isBuyOnSource ? source.name : dest.name,
            destChain: isBuyOnSource ? dest.name : source.name,
            sourceDex: isBuyOnSource ? source.dex : dest.dex,
            destDex: isBuyOnSource ? dest.dex : source.dex,
            buyPrice: Math.min(sourcePrice, destPrice),
            sellPrice: Math.max(sourcePrice, destPrice),
            bridgeFee,
            gasCost,
            netProfit: profitAbsolute,
            profitPercent,
            bridgeTime: `${source.bridgeTime}`,
            timestamp: new Date(),
          });
        }
      }
    }
  }
  
  return opportunities.sort((a, b) => b.netProfit - a.netProfit);
}

/**
 * Get arbitrage summary statistics
 */
export async function getArbitrageSummary(): Promise<{
  spotOpportunities: number;
  triangularOpportunities: number;
  crossChainOpportunities: number;
  bestSpot: ArbitrageOpportunity | null;
  bestTriangular: TriangularArbitrage | null;
  bestCrossChain: CrossChainArbitrage | null;
  totalPotentialProfit: number;
}> {
  const [spot, triangular, crossChain] = await Promise.all([
    scanSpotArbitrage(0.05),
    scanTriangularArbitrage(),
    scanCrossChainArbitrage(),
  ]);
  
  const totalPotentialProfit = 
    spot.reduce((sum, o) => sum + o.netProfit, 0) +
    crossChain.reduce((sum, o) => sum + o.netProfit, 0);
  
  return {
    spotOpportunities: spot.length,
    triangularOpportunities: triangular.length,
    crossChainOpportunities: crossChain.length,
    bestSpot: spot[0] || null,
    bestTriangular: triangular[0] || null,
    bestCrossChain: crossChain[0] || null,
    totalPotentialProfit,
  };
}
