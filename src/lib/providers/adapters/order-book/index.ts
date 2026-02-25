/**
 * Order Book Chain — Pre-wired provider chain for order book data
 *
 * | Provider      | Priority | Weight | Rate Limit      | Coverage    |
 * |---------------|----------|--------|-----------------|-------------|
 * | Binance       | 1        | 0.50   | 1200/min (free) | 600+ pairs  |
 *
 * @module providers/adapters/order-book
 */

import type { ProviderChainConfig, ResolutionStrategy } from '../../types';
import { ProviderChain } from '../../provider-chain';
import type { OrderBookData } from './types';
import { binanceOrderBookAdapter } from './binance-orderbook.adapter';

export type { OrderBookData, OrderBookLevel } from './types';

export interface OrderBookChainOptions {
  strategy?: ResolutionStrategy;
  cacheTtlSeconds?: number;
  staleWhileError?: boolean;
}

export function createOrderBookChain(options: OrderBookChainOptions = {}): ProviderChain<OrderBookData[]> {
  const {
    strategy = 'fallback',
    cacheTtlSeconds = 5,  // Order books change fast
    staleWhileError = true,
  } = options;

  const config: Partial<ProviderChainConfig> = {
    strategy,
    cacheTtlSeconds,
    staleWhileError,
  };

  const chain = new ProviderChain<OrderBookData[]>('order-book', config);
  chain.addProvider(binanceOrderBookAdapter);
  return chain;
}

export const orderBookChain = createOrderBookChain();
