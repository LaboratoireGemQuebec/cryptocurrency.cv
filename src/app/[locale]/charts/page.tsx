/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';
import ChartsClient from './ChartsClient';

export function generateMetadata(): Metadata {
  return generateSEOMetadata({
    title: 'TradingView Charts',
    description: 'Professional cryptocurrency charts powered by TradingView with 100+ technical indicators, drawing tools, and real-time data from major exchanges.',
    path: '/charts',
    tags: ['crypto charts', 'tradingview', 'technical analysis', 'bitcoin chart', 'price chart'],
  });
}

export default function ChartsPage() {
  return <ChartsClient />;
}
