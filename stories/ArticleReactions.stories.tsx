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
import { ArticleReactions } from '../src/components/ArticleReactions';

const meta: Meta<typeof ArticleReactions> = {
  title: 'Components/ArticleReactions',
  component: ArticleReactions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    articleId: 'story-1',
  },
};

export const WithInitialReactions: Story = {
  args: {
    articleId: 'story-2',
  },
  play: async ({ canvasElement }) => {
    // Simulate clicks on reactions
  },
};

export const Compact: Story = {
  args: {
    articleId: 'story-3',
    variant: 'compact',
  },
};
