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
import PortfolioContent from './PortfolioContent';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Portfolio — Track Your Crypto Holdings',
  description: 'Track and manage your cryptocurrency portfolio with real-time prices.',
  path: '/portfolio',
  noindex: true,
});

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PortfolioContent />;
}
