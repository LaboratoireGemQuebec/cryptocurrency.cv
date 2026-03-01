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
import OriginsDashboard from './OriginsDashboard';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Origins | Find Original Crypto News Sources',
  description: 'Discover original sources for crypto news. Track how stories propagate and find primary sources.',
  path: '/origins',
  tags: ['original source', 'crypto news source', 'primary source', 'news propagation', 'source tracking'],
});

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OriginsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Original Sources</h1>
          <p className="text-gray-400">
            Find original sources and track how crypto news stories propagate.
          </p>
        </div>
        <OriginsDashboard />
      </main>
      <Footer />
    </div>
  );
}
