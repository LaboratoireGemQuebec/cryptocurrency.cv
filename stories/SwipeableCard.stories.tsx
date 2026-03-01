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
import SwipeableCard from '../src/components/SwipeableCard';

const meta: Meta<typeof SwipeableCard> = {
  title: 'Components/SwipeableCard',
  component: SwipeableCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    threshold: { control: { type: 'range', min: 50, max: 200, step: 10 } },
  },
};

export default meta;
type Story = StoryObj<typeof SwipeableCard>;

export const Default: Story = {
  args: {
    threshold: 100,
    onSwipeLeft: () => alert('Swiped left — Dismissed!'),
    onSwipeRight: () => alert('Swiped right — Saved!'),
    leftAction: (
      <div className="flex items-center gap-2 text-white">
        <span>🗑️</span>
        <span className="font-medium">Dismiss</span>
      </div>
    ),
    rightAction: (
      <div className="flex items-center gap-2 text-white">
        <span>⭐</span>
        <span className="font-medium">Save</span>
      </div>
    ),
  },
  render: (args) => (
    <div className="max-w-sm">
      <SwipeableCard {...args}>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            Bitcoin ETF Sees $2.1B in Second Day Inflows
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            CoinDesk · 30 minutes ago
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            Swipe left to dismiss, right to save. On mobile use touch; on desktop drag.
          </p>
        </div>
      </SwipeableCard>
    </div>
  ),
};

export const RightActionOnly: Story = {
  name: 'Right swipe only (save)',
  args: {
    onSwipeRight: () => alert('Saved!'),
    rightAction: (
      <div className="flex items-center gap-2 text-white">
        <span>🔖</span>
        <span className="font-medium">Bookmark</span>
      </div>
    ),
  },
  render: (args) => (
    <div className="max-w-sm">
      <SwipeableCard {...args}>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
            Ethereum Staking Rate Hits 5.8%
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Swipe right to bookmark</p>
        </div>
      </SwipeableCard>
    </div>
  ),
};

export const DarkBackground: Story = {
  args: {
    onSwipeLeft: () => alert('Dismissed!'),
    leftAction: <div className="text-white">🗑️ Dismiss</div>,
  },
  render: (args) => (
    <div className="max-w-sm">
      <SwipeableCard {...args}>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <h3 className="font-semibold text-sm text-white">Dark mode card</h3>
        </div>
      </SwipeableCard>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
