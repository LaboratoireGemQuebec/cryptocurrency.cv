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
  title: 'Settings — Customize Your Experience',
  description:
    'Customize your Free Crypto News experience. Configure currency, language, notification preferences, layout, and data display options.',
  path: '/settings',
  tags: ['settings', 'preferences', 'customize', 'crypto news'],
  noindex: true,
});

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
