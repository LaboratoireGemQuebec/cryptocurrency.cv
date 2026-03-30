/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 */

/**
 * Image Sitemap Generator
 *
 * Generates an image sitemap for improved Google Image Search indexing.
 * Includes blog post images and top coin logos.
 *
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */

import { NextResponse } from 'next/server';
import { getAllPostsMeta } from '@/lib/blog';
import { SITE_URL } from '@/lib/constants';

// CoinGecko large image URLs for top coins
const coinImages: { id: string; name: string; symbol: string }[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
  { id: 'uniswap', name: 'Uniswap', symbol: 'UNI' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
  { id: 'cosmos', name: 'Cosmos', symbol: 'ATOM' },
  { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB' },
  { id: 'optimism', name: 'Optimism', symbol: 'OP' },
  { id: 'aptos', name: 'Aptos', symbol: 'APT' },
  { id: 'sui', name: 'Sui', symbol: 'SUI' },
  { id: 'injective', name: 'Injective', symbol: 'INJ' },
  { id: 'render-token', name: 'Render', symbol: 'RNDR' },
  { id: 'stellar', name: 'Stellar', symbol: 'XLM' },
  { id: 'monero', name: 'Monero', symbol: 'XMR' },
  { id: 'filecoin', name: 'Filecoin', symbol: 'FIL' },
  { id: 'hedera-hashgraph', name: 'Hedera', symbol: 'HBAR' },
  { id: 'aave', name: 'Aave', symbol: 'AAVE' },
  { id: 'maker', name: 'MakerDAO', symbol: 'MKR' },
  { id: 'lido-dao', name: 'Lido DAO', symbol: 'LDO' },
  { id: 'the-graph', name: 'The Graph', symbol: 'GRT' },
  { id: 'kaspa', name: 'Kaspa', symbol: 'KAS' },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const blogPosts = getAllPostsMeta();

  // Build entries: one <url> per page with embedded <image:image> elements
  const urlEntries: string[] = [];

  // Blog post images
  for (const post of blogPosts) {
    if (!post.image) continue;
    const imageUrl = post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`;
    urlEntries.push(`  <url>
    <loc>${escapeXml(`${SITE_URL}/en/blog/${post.slug}`)}</loc>
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
      <image:caption>${escapeXml(post.description)}</image:caption>
    </image:image>
  </url>`);
  }

  // Coin page images via CoinGecko CDN
  for (const coin of coinImages) {
    // CoinGecko large image format
    const cgImageUrl = `https://assets.coingecko.com/coins/images/1/large/${coin.id}.png`;
    urlEntries.push(`  <url>
    <loc>${escapeXml(`${SITE_URL}/en/coin/${coin.id}`)}</loc>
    <image:image>
      <image:loc>${escapeXml(`${SITE_URL}/api/og/coin?name=${encodeURIComponent(coin.name)}&symbol=${encodeURIComponent(coin.symbol)}`)}</image:loc>
      <image:title>${escapeXml(`${coin.name} (${coin.symbol}) Price & News`)}</image:title>
      <image:caption>${escapeXml(`Live ${coin.name} price chart, market data and latest news on Crypto Vision`)}</image:caption>
    </image:image>
    <image:image>
      <image:loc>${escapeXml(cgImageUrl)}</image:loc>
      <image:title>${escapeXml(`${coin.name} logo`)}</image:title>
    </image:image>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${urlEntries.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
