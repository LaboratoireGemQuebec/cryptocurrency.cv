import type { Meta, StoryObj } from '@storybook/react';
import {
  Skeleton,
  ArticleCardSkeleton,
  FeaturedArticleSkeleton,
  MarketStatsSkeleton,
  PostsGridSkeleton,
  PriceTickerSkeleton,
} from '../src/components/Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Base: Story = {
  name: 'Base skeleton block',
  render: () => (
    <div className="space-y-3 max-w-md">
      <Skeleton className="h-8 w-64 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-4/5 rounded" />
      <Skeleton className="h-4 w-3/5 rounded" />
    </div>
  ),
};

export const ArticleCard: Story = {
  name: 'Article card skeleton',
  render: () => (
    <div className="max-w-md">
      <ArticleCardSkeleton />
    </div>
  ),
};

export const FeaturedArticle: Story = {
  name: 'Featured article skeleton',
  render: () => (
    <div className="max-w-lg">
      <FeaturedArticleSkeleton />
    </div>
  ),
};

export const MarketStats: Story = {
  name: 'Market stats skeleton',
  render: () => (
    <div className="max-w-sm">
      <MarketStatsSkeleton />
    </div>
  ),
};

export const PostsGrid: Story = {
  name: 'Posts grid skeleton (6 items)',
  render: () => (
    <div className="max-w-3xl">
      <PostsGridSkeleton count={6} />
    </div>
  ),
};

export const PriceTicker: Story = {
  name: 'Price ticker skeleton',
  render: () => <PriceTickerSkeleton />,
};

export const DarkBackground: Story = {
  name: 'Dark background',
  render: () => (
    <div className="space-y-4 max-w-md">
      <Skeleton className="h-8 w-48 rounded" />
      <ArticleCardSkeleton />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
