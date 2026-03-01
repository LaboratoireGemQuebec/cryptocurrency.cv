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
import { BullBearDebate } from '../src/components/BullBearDebate';

const meta: Meta<typeof BullBearDebate> = {
  title: 'Components/BullBearDebate',
  component: BullBearDebate,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    topic: { control: 'text' },
    articleContent: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof BullBearDebate>;

export const BitcoinDebate: Story = {
  name: 'Bitcoin topic',
  args: {
    topic: 'Bitcoin',
  },
};

export const EthereumDebate: Story = {
  name: 'Ethereum topic',
  args: {
    topic: 'Ethereum',
  },
};

export const SolanaDebate: Story = {
  name: 'Solana topic',
  args: {
    topic: 'Solana',
  },
};

export const WithArticleContent: Story = {
  name: 'With article content',
  args: {
    topic: 'SEC approves Bitcoin ETF',
    articleContent:
      'The SEC has officially approved spot Bitcoin ETFs, allowing institutional investors to gain direct exposure to Bitcoin through traditional brokerage accounts. This marks a major milestone in the adoption of cryptocurrency by traditional finance.',
  },
};

export const DeFiTopic: Story = {
  name: 'DeFi topic',
  args: {
    topic: 'DeFi Summer 2.0',
  },
};

export const DarkBackground: Story = {
  args: {
    topic: 'Bitcoin',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
