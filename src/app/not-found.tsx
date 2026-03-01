/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import Link from 'next/link';

const quickLinks = [
  { href: '/', label: 'Latest News', icon: '📰' },
  { href: '/markets', label: 'Markets', icon: '📈' },
  { href: '/search', label: 'Search', icon: '🔍' },
  { href: '/trending', label: 'Trending', icon: '🔥' },
  { href: '/category/bitcoin', label: 'Bitcoin', icon: '₿' },
  { href: '/category/ethereum', label: 'Ethereum', icon: 'Ξ' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black px-4 py-16">
      <div className="text-center max-w-lg">
        {/* Animated 404 */}
        <div className="relative mb-6">
          <h1 className="text-[10rem] font-black leading-none text-gray-100 dark:text-white/60 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl" role="img" aria-label="Not found">🔍</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or
          you may have mistyped the URL.
        </p>

        {/* Primary CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
          </svg>
          Back to Home
        </Link>

        {/* Quick links grid */}
        <div className="mt-10">
          <p className="text-sm font-medium text-gray-400 dark:text-slate-500 mb-4">
            Or try one of these:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-slate-500 hover:shadow-md transition-all text-center"
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-xs font-medium text-gray-600 dark:text-slate-400">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
