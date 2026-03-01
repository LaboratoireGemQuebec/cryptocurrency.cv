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
  title: 'Install Free Crypto News — PWA App',
  description:
    'Install Free Crypto News as a progressive web app on your device. Get instant access to real-time crypto news, price alerts, and market data.',
  path: '/install',
  tags: ['install', 'PWA', 'app', 'crypto news', 'progressive web app'],
});

export default function InstallLayout({ children }: { children: React.ReactNode }) {
  return children;
}
