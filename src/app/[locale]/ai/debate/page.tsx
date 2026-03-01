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
import DebateClient from './DebateClient';
import { generateSEOMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSEOMetadata({
    title: 'The Debate — AI Bull vs Bear Analysis',
    description: 'Get AI-powered bull and bear perspectives on any crypto topic. Enter any claim and see both sides of the argument.',
    path: '/ai/debate',
    locale,
    tags: ['bull bear', 'AI debate', 'crypto analysis', 'bull case', 'bear case', 'two sides'],
  });
}

export default async function DebatePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DebateClient />;
}
