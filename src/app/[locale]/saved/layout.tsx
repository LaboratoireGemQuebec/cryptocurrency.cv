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
  title: 'Saved Articles — Your Bookmarked Crypto News',
  description:
    'View and manage your saved cryptocurrency news articles. Bookmark breaking stories, analysis, and market updates to read later.',
  path: '/saved',
  tags: ['saved articles', 'bookmarks', 'crypto news', 'reading list'],
  noindex: true,
});

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
