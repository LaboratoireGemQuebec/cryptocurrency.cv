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
import TrendingTopics from '../src/components/TrendingTopics';

const mockTopics = [
  { name: 'Bitcoin ETF', slug: 'bitcoin-etf', count: 24 },
  { name: 'Ethereum Upgrade', slug: 'ethereum', count: 18 },
  { name: 'DeFi Summer 2.0', slug: 'defi', count: 15 },
  { name: 'SEC Regulation', slug: 'regulation', count: 12 },
  { name: 'NFT Renaissance', slug: 'nft', count: 9 },
  { name: 'Stablecoins', slug: 'stablecoin', count: 8 },
  { name: 'Layer 2 Scaling', slug: 'layer2', count: 7 },
  { name: 'Bitcoin Mining', slug: 'mining', count: 5 },
];

const meta: Meta<typeof TrendingTopics> = {
  title: 'Components/TrendingTopics',
  component: TrendingTopics,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    topics: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof TrendingTopics>;

export const Default: Story = {
  args: {
    topics: mockTopics,
  },
};

export const FewTopics: Story = {
  name: 'Few topics (3)',
  args: {
    topics: mockTopics.slice(0, 3),
  },
};

export const DefaultFallback: Story = {
  name: 'Default built-in topics',
  args: {
    // No topics passed — uses component defaults
  },
};

export const HighCounts: Story = {
  name: 'High article counts',
  args: {
    topics: [
      { name: 'Bitcoin Halving', slug: 'bitcoin-halving', count: 892 },
      { name: 'Ethereum ETF', slug: 'ethereum-etf', count: 654 },
      { name: 'DeFi Hacks', slug: 'defi-hacks', count: 447 },
      { name: 'AI + Crypto', slug: 'ai-crypto', count: 312 },
      { name: 'Memecoins', slug: 'meme', count: 201 },
    ],
  },
};

export const DarkBackground: Story = {
  args: {
    topics: mockTopics,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
