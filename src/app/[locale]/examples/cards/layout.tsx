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
  title: 'Card Components — Design Examples',
  description:
    'Interactive showcase of Free Crypto News article card components. Browse large, medium, small, and list card layouts with live previews.',
  path: '/examples/cards',
  tags: ['components', 'cards', 'design', 'examples'],
  noindex: true,
});

export default function CardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
