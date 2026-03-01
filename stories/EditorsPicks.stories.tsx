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
import EditorsPicks from '../src/components/EditorsPicks';

const now = Date.now();

const mockArticles = [
  {
    title: 'Bitcoin ETF Approval Marks Watershed Moment for Crypto Mainstream Adoption',
    link: 'https://coindesk.com/btc-etf-approved',
    description: 'The SEC approval of spot Bitcoin ETFs opens the door for trillions in institutional capital to flow into crypto markets.',
    pubDate: new Date(now - 3600000).toISOString(),
    source: 'CoinDesk',
    timeAgo: '1h ago',
    category: 'general',
  },
  {
    title: 'Ethereum Layer 2 Networks Process More Transactions Than Ethereum Mainnet',
    link: 'https://theblock.co/l2-surpasses-mainnet',
    description: 'Combined L2 transaction volume has surpassed the Ethereum mainnet for the first time since high-performance rollups launched.',
    pubDate: new Date(now - 5400000).toISOString(),
    source: 'The Block',
    timeAgo: '1.5h ago',
    category: 'ethereum',
  },
  {
    title: 'DeFi Protocol Raises $100M to Build Next-Generation Lending Markets',
    link: 'https://decrypt.co/defi-100m-raise',
    description: 'A new DeFi protocol has raised $100 million to compete with Aave and Compound.',
    pubDate: new Date(now - 7200000).toISOString(),
    source: 'Decrypt',
    timeAgo: '2h ago',
    category: 'defi',
  },
  {
    title: 'Solana NFT Market Rebounds with 300% Volume Surge',
    link: 'https://cointelegraph.com/solana-nft-rebound',
    description: 'NFT trading volume on Solana has surged 300% week-over-week, driven by new PFP collections.',
    pubDate: new Date(now - 9000000).toISOString(),
    source: 'CoinTelegraph',
    timeAgo: '2.5h ago',
    category: 'nft',
  },
  {
    title: 'Bitcoin Mining Difficulty Hits All-Time High After Hash Rate Surge',
    link: 'https://bitcoinmagazine.com/mining-ath',
    description: 'Bitcoin mining difficulty reached a new all-time high as network hash rate breaks records.',
    pubDate: new Date(now - 10800000).toISOString(),
    source: 'Bitcoin Magazine',
    timeAgo: '3h ago',
    category: 'bitcoin',
  },
];

const meta: Meta<typeof EditorsPicks> = {
  title: 'Components/EditorsPicks',
  component: EditorsPicks,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EditorsPicks>;

export const Default: Story = {
  args: {
    articles: mockArticles,
  },
};

export const TwoArticles: Story = {
  name: 'Two articles (featured pair only)',
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
