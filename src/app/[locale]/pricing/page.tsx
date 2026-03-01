/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingContent from './PricingContent';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Pricing — Free API & x402 Pay-Per-Request',
  description: 'Free tier with unlimited access to news endpoints. Premium endpoints available via x402 pay-per-request USDC micropayments. No subscriptions needed.',
  path: '/pricing',
  tags: ['crypto API pricing', 'x402', 'micropayments', 'pay per request', 'USDC', 'Base network', 'free crypto API'],
});

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('common');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />
      <main className="pt-16">
        <PricingContent />
      </main>
      <Footer />
    </div>
  );
}
