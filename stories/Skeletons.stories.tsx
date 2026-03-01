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
import { 
  ArticleCardSkeleton, 
  HeroSkeleton, 
  TrendingItemSkeleton,
  PageSkeleton,
} from '../src/components/Skeletons';

const meta: Meta = {
  title: 'Components/Skeletons',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const ArticleCard: Story = {
  render: () => <ArticleCardSkeleton />,
};

export const ArticleCardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
    </div>
  ),
};

export const Hero: Story = {
  render: () => <HeroSkeleton />,
};

export const TrendingItem: Story = {
  render: () => <TrendingItemSkeleton />,
};

export const TrendingList: Story = {
  render: () => (
    <div className="space-y-3 max-w-sm">
      <TrendingItemSkeleton />
      <TrendingItemSkeleton />
      <TrendingItemSkeleton />
      <TrendingItemSkeleton />
      <TrendingItemSkeleton />
    </div>
  ),
};

export const FullPage: Story = {
  render: () => <PageSkeleton />,
  parameters: {
    layout: 'fullscreen',
  },
};
