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
import { FearGreedIndex } from '../src/components/FearGreedIndex';

const meta: Meta<typeof FearGreedIndex> = {
  title: 'Components/FearGreedIndex',
  component: FearGreedIndex,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showBreakdown: { control: 'boolean' },
    showHistory: { control: 'boolean' },
    historyDays: { control: { type: 'range', min: 7, max: 30, step: 7 } },
  },
};

export default meta;
type Story = StoryObj<typeof FearGreedIndex>;

export const Default: Story = {
  args: {
    showBreakdown: true,
    showHistory: true,
    historyDays: 14,
  },
};

export const CompactNoBreakdown: Story = {
  name: 'Compact (no breakdown)',
  args: {
    showBreakdown: false,
    showHistory: false,
    historyDays: 7,
  },
};

export const BreakdownOnly: Story = {
  name: 'Breakdown only (no history)',
  args: {
    showBreakdown: true,
    showHistory: false,
  },
};

export const LongHistory: Story = {
  name: 'Long history (30 days)',
  args: {
    showBreakdown: false,
    showHistory: true,
    historyDays: 30,
  },
};

export const DarkBackground: Story = {
  args: {
    showBreakdown: true,
    showHistory: true,
    historyDays: 14,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
