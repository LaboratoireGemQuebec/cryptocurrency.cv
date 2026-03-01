/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import { type Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { OracleChat } from '@/components/OracleChat';
import { generateSEOMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'oracle' });
  return generateSEOMetadata({
    title: t('title'),
    description: t('description'),
    path: '/oracle',
    locale,
    tags: ['crypto oracle', 'AI assistant', 'crypto questions', 'market intelligence'],
  });
}

export default async function OraclePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="container mx-auto px-4 py-8">
      <OracleChat />
    </main>
  );
}
