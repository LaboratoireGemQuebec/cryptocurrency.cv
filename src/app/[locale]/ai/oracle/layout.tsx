/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'AI Oracle — Ask Anything About Crypto',
  description:
    'AI-powered crypto oracle. Ask questions about Bitcoin, Ethereum, DeFi, market trends, and get instant answers backed by real-time news and data.',
  path: '/ai/oracle',
  tags: ['AI oracle', 'crypto AI', 'ask AI', 'bitcoin AI', 'crypto assistant', 'market analysis'],
});

export default function OracleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
