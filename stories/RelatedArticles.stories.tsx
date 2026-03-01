/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../messages/en.json';
import { RelatedArticles } from '../src/components/RelatedArticles';
import type { EnrichedArticle } from '../src/lib/archive-v2';

const withI18n = (Story: React.ComponentType) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <Story />
  </NextIntlClientProvider>
);

const baseArticle: Partial<EnrichedArticle> = {
  schema_version: '2.0',
  canonical_link: '',
  content_hash: 'abc123',
  fetch_count: 1,
  tickers: [],
  entities: { people: [], companies: [], protocols: [] },
  tags: [],
  sentiment: { score: 0, label: 'neutral', confidence: 0.8 },
  market_context: null,
  first_seen: new Date(Date.now() - 3600000).toISOString(),
  last_seen: new Date().toISOString(),
};

const mockArticles: EnrichedArticle[] = [
  {
    ...(baseArticle as EnrichedArticle),
    id: '1',
    title: 'Bitcoin ETF Sees Record $2.1B in Inflows on Second Day',
    link: 'https://example.com/1',
    description: 'Institutional demand for spot Bitcoin ETFs surges.',
    source: 'CoinDesk',
    source_key: 'coindesk',
    category: 'general',
    pub_date: new Date(Date.now() - 3600000).toISOString(),
    tickers: ['BTC'],
  },
  {
    ...(baseArticle as EnrichedArticle),
    id: '2',
    title: 'Ethereum Staking Yields Rise to 5.8% as Network Activity Spikes',
    link: 'https://example.com/2',
    description: 'Ethereum validators are earning increased rewards.',
    source: 'The Block',
    source_key: 'theblock',
    category: 'ethereum',
    pub_date: new Date(Date.now() - 7200000).toISOString(),
    tickers: ['ETH'],
  },
  {
    ...(baseArticle as EnrichedArticle),
    id: '3',
    title: 'DeFi Protocol Uniswap v4 Launches with Major Fee Improvements',
    link: 'https://example.com/3',
    description: 'The new version dramatically reduces gas costs for traders.',
    source: 'Decrypt',
    source_key: 'decrypt',
    category: 'defi',
    pub_date: new Date(Date.now() - 10800000).toISOString(),
    tickers: ['UNI'],
  },
  {
    ...(baseArticle as EnrichedArticle),
    id: '4',
    title: 'Solana Surpasses Ethereum in Daily Transaction Volume',
    link: 'https://example.com/4',
    description: 'High throughput and low fees drive Solana adoption.',
    source: 'CoinTelegraph',
    source_key: 'cointelegraph',
    category: 'general',
    pub_date: new Date(Date.now() - 14400000).toISOString(),
    tickers: ['SOL'],
  },
];

const meta: Meta<typeof RelatedArticles> = {
  title: 'Components/RelatedArticles',
  component: RelatedArticles,
  decorators: [withI18n],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RelatedArticles>;

export const Default: Story = {
  args: {
    articles: mockArticles,
  },
};

export const TwoArticles: Story = {
  name: 'Two articles',
  args: {
    articles: mockArticles.slice(0, 2),
  },
};

export const Empty: Story = {
  name: 'Empty (renders null)',
  args: {
    articles: [],
  },
};

export const DarkBackground: Story = {
  args: {
    articles: mockArticles,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
