/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

/**
 * OpenAPI 3.1.0 Specification Generator
 *
 * Generates the canonical discovery document for x402scan registration.
 * Every paid endpoint includes x-payment-info with protocol and pricing.
 *
 * @see https://github.com/Merit-Systems/x402scan
 */

import {
  API_PRICING,
  PREMIUM_PRICING,
  ENDPOINT_METADATA,
} from '@/lib/x402/pricing';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build an x-payment-info block for a fixed-price endpoint */
function paymentInfo(usdPrice: string) {
  return {
    protocols: ['x402'],
    pricingMode: 'fixed' as const,
    price: usdPrice.replace('$', ''),
  };
}

/** Convert an ENDPOINT_METADATA parameters map to OpenAPI parameters array */
function toOpenAPIParams(
  params: Record<
    string,
    { type: string; description: string; required?: boolean; default?: string }
  > | undefined,
) {
  if (!params) return undefined;
  return Object.entries(params).map(([name, p]) => ({
    name,
    in: 'query' as const,
    required: p.required ?? false,
    description: p.description,
    schema: {
      type: p.type === 'number' ? 'number' : 'string',
      ...(p.default !== undefined ? { default: p.default } : {}),
    },
  }));
}

// ---------------------------------------------------------------------------
// Spec generator
// ---------------------------------------------------------------------------

export function generateOpenAPISpec() {
  // -- Build paths from v1 pricing config ----------------------------------
  const paths: Record<string, Record<string, unknown>> = {};

  for (const [path, price] of Object.entries(API_PRICING)) {
    const meta = ENDPOINT_METADATA[path];
    const description = meta?.description ?? `API endpoint: ${path}`;
    const tag = categoriseV1(path);

    paths[path] = {
      get: {
        summary: description,
        description,
        tags: [tag],
        ...(meta?.parameters
          ? { parameters: toOpenAPIParams(meta.parameters) }
          : {}),
        responses: {
          '200': { description: 'Successful response' },
          '402': { description: 'Payment Required' },
          '429': { description: 'Rate limit exceeded' },
        },
        'x-payment-info': paymentInfo(price),
        security: [{ ApiKeyAuth: [] }, { X402Payment: [] }],
      },
    };
  }

  // -- Build paths from premium pricing config -----------------------------
  const postRoutes = new Set([
    '/api/premium/portfolio/analytics',
    '/api/premium/alerts/create',
  ]);

  for (const [path, config] of Object.entries(PREMIUM_PRICING)) {
    const method = postRoutes.has(path) ? 'post' : 'get';
    const priceStr = `${config.price}`;

    const operation: Record<string, unknown> = {
      summary: config.description,
      description: config.description,
      tags: [premiumTag(config.category)],
      responses: {
        '200': { description: 'Successful response' },
        '402': { description: 'Payment Required' },
      },
      'x-payment-info': paymentInfo(priceStr),
      security: [{ X402Payment: [] }],
    };

    paths[path] = { [method]: operation };
  }

  // -- Assemble full spec --------------------------------------------------
  return {
    openapi: '3.1.0',
    info: {
      title: 'Crypto Vision News API',
      version: '1.0.0',
      description:
        'Comprehensive cryptocurrency news and market data API with x402 micropayments. ' +
        'Access real-time crypto news, market data, AI trading signals, DeFi analytics, ' +
        'whale tracking, and portfolio tools. Pay per request with USDC via x402.',
      contact: {
        name: 'Crypto Vision News',
        url: 'https://github.com/nirholas/free-crypto-news',
      },
      license: {
        name: 'SEE LICENSE IN LICENSE',
        url: 'https://github.com/nirholas/free-crypto-news/blob/main/LICENSE',
      },
      'x-guidance':
        'This API serves real-time cryptocurrency data. All /api/v1/* and /api/premium/* ' +
        'endpoints require x402 micropayment (USDC on Base or Arbitrum). ' +
        'Prices range from $0.001 to $0.20 per request. ' +
        'Use the x-payment-info on each operation to determine the price. ' +
        'Endpoints return JSON. Query parameters are used for filtering and pagination. ' +
        'Start with /api/v1/news for latest crypto news or /api/v1/coins for market data. ' +
        'Premium endpoints under /api/premium/ offer AI analysis, whale tracking, and streaming.',
    },
    servers: [
      { url: 'https://cryptocurrency.cv', description: 'Production' },
    ],
    tags: [
      { name: 'News', description: 'Cryptocurrency news and content' },
      { name: 'Market Data', description: 'Real-time prices and market metrics' },
      { name: 'AI Analysis', description: 'AI-powered sentiment, signals, and insights' },
      { name: 'Trading', description: 'Derivatives, signals, and arbitrage' },
      { name: 'DeFi', description: 'DeFi protocols, DEX, yields, and bridges' },
      { name: 'On-Chain', description: 'On-chain data, whale alerts, and NFTs' },
      { name: 'Social', description: 'Social intelligence and influencer data' },
      { name: 'Portfolio', description: 'Portfolio, watchlist, and alerts' },
      { name: 'Analytics', description: 'Anomalies, correlations, and entities' },
      { name: 'Export', description: 'Bulk data export and historical data' },
      { name: 'Feeds', description: 'RSS and SSE feeds' },
      { name: 'Premium AI', description: 'Premium AI analysis endpoints' },
      { name: 'Premium Whales', description: 'Whale and smart money tracking' },
      { name: 'Premium Market', description: 'Extended market data' },
      { name: 'Premium DeFi', description: 'Extended DeFi protocol data' },
      { name: 'Premium Alerts', description: 'Advanced alerting with webhooks' },
      { name: 'Premium Streaming', description: 'Real-time WebSocket and SSE feeds' },
      { name: 'Premium Passes', description: 'Unlimited access time passes' },
      { name: 'Premium Analytics', description: 'Advanced screener and portfolio analytics' },
      { name: 'Premium Data', description: 'Data exports' },
    ],
    paths,
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for authenticated access',
        },
        X402Payment: {
          type: 'apiKey',
          in: 'header',
          name: 'X-PAYMENT',
          description: 'x402 micropayment header (USDC on Base/Arbitrum)',
        },
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Tag helpers
// ---------------------------------------------------------------------------

function categoriseV1(path: string): string {
  if (/news|breaking|bitcoin|categories|sources|tags|articles|regulatory|academic/.test(path))
    return 'News';
  if (/coins?|market-data|trending|gas|exchanges|search|ohlcv|orderbook|fear-greed|stablecoins/.test(path))
    return 'Market Data';
  if (/sentiment|narratives|digest|summarize|ask|forecast|classify|ai\/research|ai\/explain/.test(path))
    return 'AI Analysis';
  if (/derivatives|arbitrage|signals|liquidations|funding-rates|options|backtest/.test(path))
    return 'Trading';
  if (/defi|dex|bridges|yields|token-unlocks/.test(path)) return 'DeFi';
  if (/onchain|whale-alerts|solana|l2|nft|fundamentals/.test(path))
    return 'On-Chain';
  if (/social|influencers/.test(path)) return 'Social';
  if (/portfolio|watchlist|webhooks|predictions|alerts/.test(path))
    return 'Portfolio';
  if (/anomalies|entities|claims|correlations|analytics/.test(path))
    return 'Analytics';
  if (/export|historical/.test(path)) return 'Export';
  if (/rss|sse/.test(path)) return 'Feeds';
  return 'Market Data';
}

function premiumTag(category: string): string {
  const map: Record<string, string> = {
    ai: 'Premium AI',
    whales: 'Premium Whales',
    screener: 'Premium Analytics',
    market: 'Premium Market',
    defi: 'Premium DeFi',
    data: 'Premium Data',
    analytics: 'Premium Analytics',
    alerts: 'Premium Alerts',
    realtime: 'Premium Streaming',
    pass: 'Premium Passes',
  };
  return map[category] ?? 'Premium Market';
}
