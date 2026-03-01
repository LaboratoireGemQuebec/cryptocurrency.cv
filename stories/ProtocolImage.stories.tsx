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
import ProtocolImage from '../src/components/ProtocolImage';

const meta: Meta<typeof ProtocolImage> = {
  title: 'Components/ProtocolImage',
  component: ProtocolImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ProtocolImage>;

export const ValidImage: Story = {
  name: 'Valid image URL',
  args: {
    src: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    alt: 'Bitcoin',
    className: 'w-10 h-10 rounded-full',
  },
};

export const FallbackInitial: Story = {
  name: 'Fallback (empty src)',
  args: {
    src: '',
    alt: 'Ethereum',
    className: 'w-10 h-10 rounded-full',
  },
};

export const BrokenUrl: Story = {
  name: 'Broken image URL (shows fallback)',
  args: {
    src: 'https://broken-url.example.com/missing.png',
    alt: 'Solana',
    className: 'w-10 h-10 rounded-full',
  },
};

export const LargeSize: Story = {
  name: 'Large size',
  args: {
    src: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    alt: 'Ethereum',
    className: 'w-16 h-16 rounded-xl',
  },
};

export const DarkBackground: Story = {
  args: {
    src: '',
    alt: 'BTC',
    className: 'w-10 h-10 rounded-full',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
