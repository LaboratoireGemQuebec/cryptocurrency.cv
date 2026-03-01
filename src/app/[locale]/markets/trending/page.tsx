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
 * Trending Coins Page
 * Shows trending cryptocurrencies
 */

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getTrending, getTopCoins, formatPercent } from '@/lib/market-data';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Trending Cryptocurrencies — Most Searched Coins',
  description: 'Discover the most searched and trending cryptocurrencies right now. See what the crypto community is watching.',
  path: '/markets/trending',
  tags: ['trending crypto', 'most searched coins', 'popular cryptocurrency', 'crypto trends'],
});

export const revalidate = 60;

export default async function TrendingPage() {
  const [trending, topCoins] = await Promise.all([
    getTrending(),
    getTopCoins(100),
  ]);

  // Create a map of coins for quick lookup
  const coinMap = new Map(topCoins.map((c) => [c.id, c]));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link href="/markets" className="hover:text-blue-600 dark:hover:text-blue-400">
              Markets
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Trending</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🔥 Trending Cryptocurrencies
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The most searched coins on CoinGecko in the last 24 hours
            </p>
          </div>

          {/* Trending Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.map((coin, index) => {
              const details = coinMap.get(coin.id);
              return (
                <Link
                  key={coin.id}
                  href={`/coin/${coin.id}`}
                  className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-neutral-800 p-4 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-300 dark:text-gray-400">
                        #{index + 1}
                      </span>
                      <div className="relative w-10 h-10">
                        {coin.large && (
                          <Image
                            src={coin.large}
                            alt={coin.name}
                            fill
                            className="rounded-full object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Rank #{coin.market_cap_rank || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {coin.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {coin.symbol.toUpperCase()}
                    </p>
                  </div>
                  {details && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">24h Change</span>
                        <span
                          className={`font-semibold ${
                            (details.price_change_percentage_24h || 0) >= 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {formatPercent(details.price_change_percentage_24h)}
                        </span>
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/markets"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to Markets
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
