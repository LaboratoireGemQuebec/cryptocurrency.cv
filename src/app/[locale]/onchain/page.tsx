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
import OnchainDashboard from '@/app/[locale]/onchain/OnchainDashboard';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'On-Chain Events | Crypto News Correlation',
  description: 'Correlate crypto news with on-chain events. Track whale movements, transfers, and blockchain activity.',
  path: '/onchain',
  tags: ['on-chain events', 'blockchain correlation', 'whale movements', 'crypto transfers', 'news correlation'],
});

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OnchainPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">On-Chain Events</h1>
          <p className="text-gray-400">
            Correlate crypto news with on-chain blockchain events and whale movements.
          </p>
        </div>
        <OnchainDashboard />
      </main>
      <Footer />
    </div>
  );
}
