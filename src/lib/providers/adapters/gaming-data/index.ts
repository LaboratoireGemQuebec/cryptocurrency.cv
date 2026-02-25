/**
 * Gaming Data Chain — Provider chain for blockchain gaming data
 *
 * | Provider    | Priority | Weight | Rate Limit    | Coverage          |
 * |-------------|----------|--------|---------------|-------------------|
 * | DappRadar   | 1        | 0.60   | 30/min (key)  | 3000+ dApps       |
 * | Footprint   | 2        | 0.40   | 20/min (key)  | GameFi analytics  |
 *
 * Default strategy: `fallback`
 *
 * @module providers/adapters/gaming-data
 */

import type { ProviderChainConfig, ResolutionStrategy } from '../../types';
import { ProviderChain } from '../../provider-chain';
import type { GamingData } from './types';
import { dappradarAdapter } from './dappradar.adapter';
import { footprintAdapter } from './footprint.adapter';

export type { GamingData, GameData } from './types';

export interface GamingChainOptions {
  strategy?: ResolutionStrategy;
  cacheTtlSeconds?: number;
  staleWhileError?: boolean;
}

export function createGamingChain(options: GamingChainOptions = {}): ProviderChain<GamingData> {
  const {
    strategy = 'fallback',
    cacheTtlSeconds = 300,
    staleWhileError = true,
  } = options;

  const config: Partial<ProviderChainConfig> = { strategy, cacheTtlSeconds, staleWhileError };
  const chain = new ProviderChain<GamingData>('gaming-data', config);

  chain.addProvider(dappradarAdapter);
  chain.addProvider(footprintAdapter);

  return chain;
}

/** Default gaming data chain */
export const gamingChain = createGamingChain();
