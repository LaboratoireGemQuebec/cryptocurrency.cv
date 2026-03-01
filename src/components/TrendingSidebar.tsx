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
 * Trending Sidebar - Right column with trending, categories, and market data
 * Sticky sidebar for desktop views
 */

import Link from 'next/link';
import { categories } from '@/lib/categories';
import NewsCard from '@/components/NewsCard';
import { PredictionPoll } from '@/components/PredictionPoll';

interface Article {
  title: string;
  link: string;
  description?: string;
  pubDate: string;
  source: string;
  timeAgo: string;
}

interface TrendingSidebarProps {
  trendingArticles: Article[];
}

export default function TrendingSidebar({ trendingArticles }: TrendingSidebarProps) {
  const topTrending = trendingArticles.slice(0, 5);
  const featuredCategories = categories.slice(0, 6);

  return (
    <aside className="space-y-8 lg:sticky lg:top-4">
      {/* Trending Stories */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm dark:shadow-lg">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <h3 className="font-bold text-gray-900 dark:text-white">Trending Now</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-slate-700">
          {topTrending.map((article, index) => (
            <NewsCard
              key={article.link}
              article={article}
              variant="compact"
              priority={index + 1}
            />
          ))}
        </div>
        <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-700">
          <Link 
            href="/trending" 
            className="text-sm font-semibold text-brand-600 dark:text-amber-400 hover:text-brand-700 dark:hover:text-amber-300 transition-colors flex items-center justify-center gap-1"
          >
            View All Trending
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Community Prediction */}
      <PredictionPoll />

      {/* Categories */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm dark:shadow-lg">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/50">
          <h3 className="font-bold text-gray-900 dark:text-white">
            <span className="mr-2">📁</span>
            Categories
          </h3>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors ${cat.color}`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
          <Link 
            href="/topics" 
            className="mt-3 text-sm font-semibold text-brand-600 dark:text-amber-400 hover:text-brand-700 dark:hover:text-amber-300 transition-colors flex items-center justify-center gap-1"
          >
            All Topics →
          </Link>
        </div>
      </div>


    </aside>
  );
}
