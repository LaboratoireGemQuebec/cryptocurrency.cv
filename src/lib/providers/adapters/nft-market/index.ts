/**
 * NFT Market Chain — Provider chain for NFT marketplace data
 *
 * | Provider    | Priority | Weight | Rate Limit      | Coverage             |
 * |-------------|----------|--------|-----------------|----------------------|
 * | OpenSea     | 1        | 0.50   | 40/min (key)    | Largest marketplace  |
 * | Reservoir   | 2        | 0.30   | 120/min (free)  | Aggregated listings  |
 * | SimpleHash  | 3        | 0.20   | 10/min (key)    | 80+ chains           |
 *
 * Default strategy: `broadcast` (aggregate data from all sources)
 *
 * @module providers/adapters/nft-market
 */

import type { ProviderChainConfig, ResolutionStrategy } from '../../types';
import { ProviderChain } from '../../provider-chain';
import type { NFTMarketData } from './types';
import { openseaAdapter } from './opensea.adapter';
import { reservoirAdapter } from './reservoir.adapter';
import { simplehashAdapter } from './simplehash.adapter';

export type { NFTMarketData, NFTCollection } from './types';

export interface NFTMarketChainOptions {
  strategy?: ResolutionStrategy;
  cacheTtlSeconds?: number;
  staleWhileError?: boolean;
}

export function createNFTMarketChain(options: NFTMarketChainOptions = {}): ProviderChain<NFTMarketData> {
  const {
    strategy = 'broadcast',
    cacheTtlSeconds = 120,
    staleWhileError = true,
  } = options;

  const config: Partial<ProviderChainConfig> = { strategy, cacheTtlSeconds, staleWhileError };
  const chain = new ProviderChain<NFTMarketData>('nft-market', config);

  chain.addProvider(openseaAdapter);
  chain.addProvider(reservoirAdapter);
  chain.addProvider(simplehashAdapter);

  return chain;
}

/** Default NFT market chain */
export const nftMarketChain = createNFTMarketChain();
