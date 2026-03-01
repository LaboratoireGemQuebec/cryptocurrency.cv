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
import SignalsDashboard from './SignalsDashboard';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Trading Signals | News-Based Crypto Signals',
  description: 'AI-powered trading signals derived from crypto news analysis. Educational signals with confidence scores and risk assessments.',
  path: '/signals',
  tags: ['crypto signals', 'trading signals', 'bitcoin signals', 'news-based trading', 'crypto alerts', 'AI trading'],
});

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignalsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trading Signals</h1>
          <p className="text-gray-400">
            AI-powered signals derived from news sentiment, market data, and on-chain analytics.
            For educational purposes only.
          </p>
        </div>
        <SignalsDashboard />
      </main>
      <Footer />
    </div>
  );
}
