/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import CounterClient from './CounterClient';
import { generateSEOMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSEOMetadata({
    title: 'The Counter — AI Fact-Checking & Counter-Arguments',
    description: 'AI-powered fact-checking and counter-argument generation for any crypto claim. Challenge assumptions and find hidden weaknesses.',
    path: '/ai/counter',
    locale,
    tags: ['AI fact check', 'counter arguments', 'crypto claims', 'critical analysis', 'debunk'],
  });
}

export default async function CounterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CounterClient />;
}
