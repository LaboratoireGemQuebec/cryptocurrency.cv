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
import { ArticleIntelligenceBadges } from '../src/components/ArticleIntelligenceBadges';

const meta: Meta<typeof ArticleIntelligenceBadges> = {
  title: 'Components/ArticleIntelligenceBadges',
  component: ArticleIntelligenceBadges,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showClickbait: { control: 'boolean' },
    showAiContent: { control: 'boolean' },
    showEventType: { control: 'boolean' },
    compact: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ArticleIntelligenceBadges>;

export const Default: Story = {
  args: {
    articleId: 'btc-100k-analysis',
    title: 'Bitcoin Surges Past $100K — What Happens Next?',
    showClickbait: true,
    showAiContent: true,
    showEventType: true,
    compact: false,
  },
};

export const Compact: Story = {
  args: {
    articleId: 'eth-upgrade',
    title: 'Ethereum Pectra Upgrade Final Details Revealed',
    showClickbait: true,
    showAiContent: true,
    showEventType: true,
    compact: true,
  },
};

export const ClickbaitOnly: Story = {
  name: 'Clickbait badge only',
  args: {
    articleId: 'shocking-article',
    title: 'SHOCKING: You Won\'t Believe What Bitcoin Just Did!!',
    showClickbait: true,
    showAiContent: false,
    showEventType: false,
  },
};

export const EventTypeOnly: Story = {
  name: 'Event type badge only',
  args: {
    articleId: 'funding-round',
    title: 'Layer 2 Startup Raises $50M Series B Round',
    showClickbait: false,
    showAiContent: false,
    showEventType: true,
  },
};

export const DarkBackground: Story = {
  args: {
    articleId: 'dark-test',
    title: 'DeFi Protocol Launches New Governance Token',
    showClickbait: true,
    showAiContent: true,
    showEventType: true,
    compact: false,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
