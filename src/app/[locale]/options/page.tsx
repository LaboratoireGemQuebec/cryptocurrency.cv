/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { OptionsFlowDashboard } from './OptionsFlowDashboardClient';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Options Flow | Crypto Options Trading Intelligence',
  description: 'Real-time crypto options flow tracking, volatility surface, max pain analysis, and gamma exposure. Track unusual activity on Deribit, OKX, and Bybit.',
  path: '/options',
  tags: ['crypto options', 'options flow', 'deribit', 'bitcoin options', 'ethereum options', 'max pain', 'gamma exposure', 'volatility surface', 'implied volatility'],
});

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OptionsFlowPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />
      <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Options Flow
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Real-time crypto options intelligence with flow tracking, volatility analysis, max pain,
            and gamma exposure.
          </p>
        </div>

        {/* Educational Banner */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-purple-900 dark:text-purple-200 mb-2 flex items-center gap-2">
            <span className="text-lg">🎓</span> Understanding Options Metrics
          </h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm text-purple-800 dark:text-purple-300">
            <div>
              <strong>Put/Call Ratio:</strong> {">"} 1 = Bearish sentiment, {"<"} 1 = Bullish
              sentiment
            </div>
            <div>
              <strong>Max Pain:</strong> Strike price where most options expire worthless
            </div>
            <div>
              <strong>IV (Implied Vol):</strong> Market&apos;s expected price movement percentage
            </div>
            <div>
              <strong>Gamma:</strong> Rate of change of delta - affects market maker hedging
            </div>
          </div>
        </div>

        <OptionsFlowDashboard />
      </main>
      <Footer />
    </div>
  );
}
