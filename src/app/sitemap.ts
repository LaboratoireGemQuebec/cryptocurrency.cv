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
 * Dynamic Sitemap Generator
 *
 * Generates sitemap.xml for search engine discovery
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { type MetadataRoute } from 'next';
import { getAllPostsMeta, CATEGORIES } from '@/lib/blog';
import { getAllTags } from '@/lib/tags';
import { loadTagScoresFromFile } from '@/lib/tagScoring';
import { SITE_URL } from '@/lib/constants';

// Supported locales
const locales = [
  'en',
  'es',
  'fr',
  'de',
  'ja',
  'ko',
  'zh-CN',
  'zh-TW',
  'pt',
  'ru',
  'ar',
  'it',
  'nl',
  'pl',
  'tr',
  'id',
  'th',
  'vi',
];

// Static pages with their update frequencies
const staticPages = [
  { path: '', changeFrequency: 'always' as const, priority: 1.0 },
  // Core market pages
  { path: '/markets', changeFrequency: 'hourly' as const, priority: 0.9 },
  { path: '/trending', changeFrequency: 'hourly' as const, priority: 0.9 },
  { path: '/movers', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/heatmap', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/sentiment', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/defi', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/gas', changeFrequency: 'always' as const, priority: 0.7 },
  { path: '/funding', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/liquidations', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/whales', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/onchain', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/options', changeFrequency: 'hourly' as const, priority: 0.7 },
  { path: '/orderbook', changeFrequency: 'always' as const, priority: 0.6 },
  { path: '/fear-greed', changeFrequency: 'hourly' as const, priority: 0.9 },
  { path: '/signals', changeFrequency: 'hourly' as const, priority: 0.8 },
  // Analytics & research tools
  { path: '/screener', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/calculator', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/dominance', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/correlation', changeFrequency: 'daily' as const, priority: 0.6 },
  { path: '/charts', changeFrequency: 'daily' as const, priority: 0.6 },
  { path: '/analytics', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/compare', changeFrequency: 'daily' as const, priority: 0.6 },
  { path: '/arbitrage', changeFrequency: 'hourly' as const, priority: 0.7 },
  // News & content
  { path: '/buzz', changeFrequency: 'hourly' as const, priority: 0.7 },
  { path: '/digest', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/narratives', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/topics', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/sources', changeFrequency: 'weekly' as const, priority: 0.6 },
  // AI & analysis features
  { path: '/entities', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/factcheck', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/predictions', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/influencers', changeFrequency: 'daily' as const, priority: 0.6 },
  { path: '/coverage-gap', changeFrequency: 'daily' as const, priority: 0.6 },
  { path: '/ai/oracle', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/ai/brief', changeFrequency: 'hourly' as const, priority: 0.7 },
  { path: '/ai/debate', changeFrequency: 'daily' as const, priority: 0.6 },
  { path: '/ai/counter', changeFrequency: 'daily' as const, priority: 0.6 },
  // News verticals
  { path: '/business', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/tech', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/web3', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/defi-news', changeFrequency: 'hourly' as const, priority: 0.8 },
  // Category pages
  { path: '/category/bitcoin', changeFrequency: 'hourly' as const, priority: 0.9 },
  { path: '/category/ethereum', changeFrequency: 'hourly' as const, priority: 0.9 },
  { path: '/category/defi', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/category/nft', changeFrequency: 'hourly' as const, priority: 0.7 },
  { path: '/category/regulation', changeFrequency: 'daily' as const, priority: 0.8 },
  { path: '/category/technology', changeFrequency: 'daily' as const, priority: 0.7 },
  // Regulatory & compliance
  { path: '/regulatory', changeFrequency: 'daily' as const, priority: 0.8 },
  { path: '/protocol-health', changeFrequency: 'daily' as const, priority: 0.7 },
  // Ecosystem hub pages
  { path: '/bitcoin', changeFrequency: 'hourly' as const, priority: 0.9 },
  { path: '/ethereum', changeFrequency: 'hourly' as const, priority: 0.9 },
  { path: '/solana', changeFrequency: 'hourly' as const, priority: 0.9 },
  // Additional market pages
  { path: '/derivatives', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/nft', changeFrequency: 'hourly' as const, priority: 0.7 },
  { path: '/stablecoins', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/l2', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/exchanges', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/macro', changeFrequency: 'daily' as const, priority: 0.7 },
  // Content & event pages
  { path: '/unlocks', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/events', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/regulation', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/research', changeFrequency: 'daily' as const, priority: 0.7 },
  { path: '/intelligence', changeFrequency: 'daily' as const, priority: 0.7 },
  // Info pages
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/pricing', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/status', changeFrequency: 'hourly' as const, priority: 0.5 },
  { path: '/origins', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.4 },
  { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.3 },
  { path: '/terms', changeFrequency: 'monthly' as const, priority: 0.3 },
  { path: '/learn', changeFrequency: 'weekly' as const, priority: 0.6 },
  // Docs & Developer
  { path: '/developers', changeFrequency: 'weekly' as const, priority: 0.6 },
  { path: '/developers/api', changeFrequency: 'weekly' as const, priority: 0.7 },
  { path: '/developers/sdk', changeFrequency: 'weekly' as const, priority: 0.6 },
  { path: '/developers/examples', changeFrequency: 'weekly' as const, priority: 0.6 },
];

// Top 100 coins to include in sitemap (CoinGecko IDs)
const topCoins = [
  // Top 10
  'bitcoin',
  'ethereum',
  'tether',
  'binancecoin',
  'solana',
  'ripple',
  'usd-coin',
  'staked-ether',
  'dogecoin',
  'cardano',
  // 11-25
  'tron',
  'avalanche-2',
  'shiba-inu',
  'chainlink',
  'polkadot',
  'bitcoin-cash',
  'dai',
  'uniswap',
  'litecoin',
  'near',
  'leo-token',
  'polygon',
  'internet-computer',
  'cosmos',
  'ethereum-classic',
  // 26-50
  'arbitrum',
  'optimism',
  'aptos',
  'sui',
  'injective',
  'render-token',
  'immutable-x',
  'stellar',
  'monero',
  'filecoin',
  'hedera-hashgraph',
  'vechain',
  'the-graph',
  'algorand',
  'quant-network',
  'aave',
  'maker',
  'elrond-erd-2',
  'flow',
  'theta-token',
  'axie-infinity',
  'decentraland',
  'the-sandbox',
  'gala',
  'enjincoin',
  // 51-75
  'lido-dao',
  'rocket-pool',
  'frax-share',
  'curve-dao-token',
  'convex-finance',
  'yearn-finance',
  'compound-governance-token',
  'balancer',
  'synthetix-network-token',
  'gmx',
  'dydx',
  'sushi',
  '1inch',
  'pancakeswap-token',
  'blur',
  'blur-2',
  'kaspa',
  'sei-network',
  'celestia',
  'pyth-network',
  'jito-governance-token',
  'ondo-finance',
  'starknet',
  'worldcoin-wld',
  'pendle',
  // 76-100
  'thorchain',
  'kava',
  'oasis-network',
  'harmony',
  'band-protocol',
  'ocean-protocol',
  'fetch-ai',
  'singularitynet',
  'numeraire',
  'basic-attention-token',
  'civic',
  'golem',
  'loopring',
  'zilliqa',
  'iota',
  'ontology',
  'icon',
  'wanchain',
  'status',
  'power-ledger',
  'storj',
  'request-network',
  'ankr',
  'ssv-network',
  'ethena',
];

/** Build a hreflang languages map for a given path suffix (e.g. "/markets") */
function buildAlternates(pathSuffix: string): Record<string, string> {
  const langs: Record<string, string> = { 'x-default': `${SITE_URL}/en${pathSuffix}` };
  for (const locale of locales) {
    langs[locale] = `${SITE_URL}/${locale}${pathSuffix}`;
  }
  return langs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Add one canonical entry per static page (en locale), with hreflang alternates
  for (const page of staticPages) {
    entries.push({
      url: `${SITE_URL}/en${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: buildAlternates(page.path) },
    });
  }

  // Add one canonical entry per coin (en locale), with hreflang alternates
  for (const coin of topCoins) {
    entries.push({
      url: `${SITE_URL}/en/coin/${coin}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.7,
      alternates: { languages: buildAlternates(`/coin/${coin}`) },
    });
  }

  // Add blog pages — one canonical entry per slug/category with hreflang alternates
  const blogPosts = getAllPostsMeta();

  entries.push({
    url: `${SITE_URL}/en/blog`,
    lastModified: blogPosts[0] ? new Date(blogPosts[0].date) : now,
    changeFrequency: 'daily',
    priority: 0.8,
    alternates: { languages: buildAlternates('/blog') },
  });

  for (const post of blogPosts) {
    entries.push({
      url: `${SITE_URL}/en/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: buildAlternates(`/blog/${post.slug}`) },
    });
  }

  for (const category of Object.keys(CATEGORIES)) {
    entries.push({
      url: `${SITE_URL}/en/blog/category/${category}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: { languages: buildAlternates(`/blog/category/${category}`) },
    });
  }

  // Add tag pages — one canonical entry per tag with hreflang alternates
  const allTags = getAllTags();

  entries.push({
    url: `${SITE_URL}/en/tags`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
    alternates: { languages: buildAlternates('/tags') },
  });

  for (const tag of allTags) {
    entries.push({
      url: `${SITE_URL}/en/tags/${tag.slug}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: Math.round(Math.min(0.9, 0.6 + tag.priority / 250) * 1000) / 1000,
      alternates: { languages: buildAlternates(`/tags/${tag.slug}`) },
    });
  }

  return entries;
}
