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
import { SocialShare, ShareButtons } from '../src/components/SocialShare';

const meta: Meta<typeof SocialShare> = {
  title: 'Components/SocialShare',
  component: SocialShare,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Dropdown: Story = {
  args: {
    title: 'Bitcoin Hits New All-Time High',
    url: 'https://example.com/article/bitcoin-ath',
    description: 'Bitcoin reached a new all-time high today as institutional investors continue to accumulate.',
  },
};

export const InlineButtons: Story = {
  render: () => (
    <ShareButtons
      title="Bitcoin Hits New All-Time High"
      url="https://example.com/article/bitcoin-ath"
      description="Bitcoin reached a new all-time high today."
    />
  ),
};
