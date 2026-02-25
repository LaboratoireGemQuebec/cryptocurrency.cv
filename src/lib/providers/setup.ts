/**
 * Provider Registry Setup — Wires all provider chains into the global registry
 *
 * Import this module once at app startup (e.g., in _app.ts, layout.tsx, or
 * middleware.ts) to make all data categories accessible via the registry:
 *
 * ```ts
 * import '@/lib/providers/setup';
 * import { registry } from '@/lib/providers';
 *
 * const prices = await registry.fetch('market-price', { coinIds: ['bitcoin'] });
 * const tvl    = await registry.fetch('tvl', { limit: 10 });
 * const social = await registry.fetch('social-metrics', { limit: 50 });
 * ```
 *
 * ## Registered Categories
 *
 * | Category         | Chain                  | Providers                         |
 * |-----------------|------------------------|-----------------------------------|
 * | market-price    | marketPriceChain       | CoinGecko → CoinCap → Binance    |
 * | dex             | dexChain               | DexScreener → GeckoTerminal       |
 * | fear-greed      | fearGreedChain         | Alternative.me → CoinStats        |
 * | funding-rate    | fundingRateChain       | Binance → Bybit → OKX            |
 * | gas-fees        | gasChain               | Etherscan → Blocknative           |
 * | tvl             | tvlChain               | DefiLlama                        |
 * | defi-yields     | defiYieldsChain        | DefiLlama Yields                  |
 * | derivatives     | derivativesChain       | Hyperliquid → CoinGlass           |
 * | on-chain        | onChainChain           | Blockchain.info → Etherscan       |
 * | social-metrics  | socialChain            | LunarCrush                        |
 * | stablecoin-flows| stablecoinFlowsChain   | DefiLlama Stablecoins            |
 *
 * @module providers/setup
 */

import { registry } from './registry';

// Pre-built chains
import { marketPriceChain } from './adapters/market-price';
import { dexChain } from './adapters/dex';
import { fearGreedChain } from './adapters/fear-greed';
import { fundingRateChain } from './adapters/funding-rate';
import { gasChain } from './adapters/gas';
import { tvlChain } from './adapters/tvl';
import { defiYieldsChain } from './adapters/defi';
import { derivativesChain } from './adapters/derivatives';
import { onChainChain } from './adapters/on-chain';
import { socialChain } from './adapters/social';
import { stablecoinFlowsChain } from './adapters/stablecoin-flows';

// =============================================================================
// REGISTER ALL CHAINS
// =============================================================================

// Market data
registry.register('market-price', marketPriceChain, {
  description: 'Real-time crypto prices from CoinGecko, CoinCap, Binance',
});

// DEX data
registry.register('dex', dexChain, {
  description: 'DEX pair data from DexScreener and GeckoTerminal',
});

// Fear & Greed Index
registry.register('fear-greed', fearGreedChain, {
  description: 'Crypto market sentiment from Alternative.me and CoinStats',
});

// Funding Rates
registry.register('funding-rate', fundingRateChain, {
  description: 'Perpetual funding rates from Binance, Bybit, OKX',
});

// Gas Fees
registry.register('gas-fees', gasChain, {
  description: 'Ethereum gas prices from Etherscan and Blocknative',
});

// TVL
registry.register('tvl', tvlChain, {
  description: 'DeFi protocol TVL from DefiLlama',
});

// DeFi Yields
registry.register('defi-yields', defiYieldsChain, {
  description: 'Yield and APY data from DefiLlama Yields',
});

// Derivatives (Open Interest, Liquidations)
registry.register('derivatives', derivativesChain, {
  description: 'Open interest and liquidation data from Hyperliquid and CoinGlass',
});

// On-chain Metrics
registry.register('on-chain', onChainChain, {
  description: 'Bitcoin and Ethereum on-chain data from Blockchain.info, Mempool.space, Etherscan',
});

// Social Metrics
registry.register('social-metrics', socialChain, {
  description: 'Social intelligence from LunarCrush (Galaxy Score, sentiment, social volume)',
});

// Stablecoin Flows
registry.register('stablecoin-flows', stablecoinFlowsChain, {
  description: 'Stablecoin supply and chain distribution from DefiLlama',
});

// =============================================================================
// CONVENIENCE: Export registry for re-import
// =============================================================================

export { registry };

/** Number of registered categories */
export const registeredCategories = 11;

/** List all registered categories */
export function listRegisteredCategories() {
  return [
    'market-price',
    'dex',
    'fear-greed',
    'funding-rate',
    'gas-fees',
    'tvl',
    'defi-yields',
    'derivatives',
    'on-chain',
    'social-metrics',
    'stablecoin-flows',
  ] as const;
}
