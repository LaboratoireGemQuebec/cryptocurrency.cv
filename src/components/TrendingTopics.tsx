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
 * Trending Topics Sidebar
 * Shows trending topics and tags
 */

'use client';

import Link from 'next/link';

interface Topic {
  name: string;
  slug: string;
  count: number;
}

interface TrendingTopicsProps {
  topics?: Topic[];
}

const defaultTopics: Topic[] = [
  { name: 'Bitcoin ETF', slug: 'bitcoin-etf', count: 24 },
  { name: 'Ethereum', slug: 'ethereum', count: 18 },
  { name: 'DeFi', slug: 'defi', count: 15 },
  { name: 'Regulation', slug: 'regulation', count: 12 },
  { name: 'NFTs', slug: 'nft', count: 9 },
  { name: 'Stablecoins', slug: 'stablecoin', count: 8 },
  { name: 'Layer 2', slug: 'layer2', count: 7 },
  { name: 'Mining', slug: 'mining', count: 5 },
];

export default function TrendingTopics({ topics = defaultTopics }: TrendingTopicsProps) {
  return (
    <div className="bg-white dark:bg-black rounded-xl border border-gray-200 p-6">
      <h3 className="font-bold text-lg mb-4">🔥 Trending Topics</h3>
      
      <div className="space-y-2">
        {topics.map((topic, index) => (
          <Link
            key={topic.slug}
            href={`/topic/${topic.slug}`}
            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition group"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium w-5">
                {index + 1}
              </span>
              <span className="text-gray-900 group-hover:text-blue-600 transition">
                {topic.name}
              </span>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {topic.count}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/topics"
        className="block mt-4 text-center text-sm text-blue-600 hover:underline"
      >
        View all topics →
      </Link>
    </div>
  );
}
