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
import CompareClient from './CompareClient';

export function generateMetadata(): Metadata {
  return generateSEOMetadata({
    title: 'Compare Cryptocurrencies',
    description: 'Compare performance, price, market cap, and metrics for multiple cryptocurrencies side-by-side. Supports up to 5 coins.',
    path: '/compare',
    tags: ['compare crypto', 'crypto comparison', 'bitcoin vs ethereum', 'coin comparison', 'price comparison'],
  });
}

export default function ComparePage() {
  return <CompareClient />;
}
