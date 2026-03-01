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
import { SentimentDashboard } from '../src/components/SentimentDashboard';

const meta: Meta<typeof SentimentDashboard> = {
  title: 'Components/SentimentDashboard',
  component: SentimentDashboard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    coin: { control: 'text' },
    refreshInterval: { control: { type: 'number', min: 10000, max: 300000, step: 10000 } },
  },
};

export default meta;
type Story = StoryObj<typeof SentimentDashboard>;

export const Default: Story = {
  name: 'Global market sentiment',
  args: {
    refreshInterval: 60000,
  },
};

export const Bitcoin: Story = {
  name: 'Bitcoin sentiment',
  args: {
    coin: 'BTC',
    refreshInterval: 60000,
  },
};

export const Ethereum: Story = {
  name: 'Ethereum sentiment',
  args: {
    coin: 'ETH',
    refreshInterval: 60000,
  },
};

export const Solana: Story = {
  name: 'Solana sentiment',
  args: {
    coin: 'SOL',
    refreshInterval: 60000,
  },
};

export const DarkBackground: Story = {
  args: {
    coin: 'BTC',
    refreshInterval: 60000,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
