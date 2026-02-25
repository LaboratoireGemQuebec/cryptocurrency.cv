/**
 * Macro Chain — Provider chain for macro/tradfi data
 *
 * | Provider      | Priority | Weight | Rate Limit     | Coverage              |
 * |---------------|----------|--------|----------------|-----------------------|
 * | FRED          | 1        | 0.40   | 120/min (key)  | Rates, yields, DXY    |
 * | Alpha Vantage | 2        | 0.30   | 5/min (key)    | SPY, QQQ, GLD, USO    |
 * | Twelve Data   | 3        | 0.30   | 8/min (key)    | SPX, NDX, VIX, XAU    |
 *
 * Default strategy: `broadcast` (collect all indicators from every source)
 *
 * @module providers/adapters/macro
 */

import type { ProviderChainConfig, ResolutionStrategy } from '../../types';
import { ProviderChain } from '../../provider-chain';
import type { MacroData } from './types';
import { fredAdapter } from './fred.adapter';
import { alphaVantageAdapter } from './alpha-vantage.adapter';
import { twelveDataAdapter } from './twelve-data.adapter';

export type { MacroData, MacroIndicator, MacroIndicatorId, CryptoMacroCorrelation } from './types';

export interface MacroChainOptions {
  strategy?: ResolutionStrategy;
  cacheTtlSeconds?: number;
  staleWhileError?: boolean;
}

export function createMacroChain(options: MacroChainOptions = {}): ProviderChain<MacroData> {
  const {
    strategy = 'broadcast',
    cacheTtlSeconds = 300,
    staleWhileError = true,
  } = options;

  const config: Partial<ProviderChainConfig> = { strategy, cacheTtlSeconds, staleWhileError };
  const chain = new ProviderChain<MacroData>('macro-data', config);

  chain.addProvider(fredAdapter);
  chain.addProvider(alphaVantageAdapter);
  chain.addProvider(twelveDataAdapter);

  return chain;
}

/** Default macro data chain */
export const macroChain = createMacroChain();
