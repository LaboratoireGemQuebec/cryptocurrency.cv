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
import { NextIntlClientProvider } from 'next-intl';
import messages from '../messages/en.json';
import EmptyState from '../src/components/EmptyState';

const withI18n = (Story: React.ComponentType) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <Story />
  </NextIntlClientProvider>
);

/**
 * EmptyState provides a set of contextual zero-state templates —
 * search with no results, empty bookmarks, offline mode, etc.
 */

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [withI18n],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'search', 'bookmarks', 'error', 'offline', 'loading'],
    },
    compact: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const Search: Story = {
  args: {
    variant: 'search',
    title: 'No results for "bitcoin halving 2026"',
    description: 'Try different keywords or remove filters.',
    action: { label: 'Clear search', href: '/search' },
  },
};

export const Bookmarks: Story = {
  args: {
    variant: 'bookmarks',
    action: { label: 'Browse news', href: '/' },
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    action: { label: 'Try again', onClick: () => window.location.reload() },
    secondaryAction: { label: 'Go home', href: '/' },
  },
};

export const Offline: Story = {
  args: {
    variant: 'offline',
    action: { label: 'Retry', onClick: () => window.location.reload() },
  },
};

export const Loading: Story = {
  args: { variant: 'loading' },
};

export const Compact: Story = {
  args: { variant: 'search', compact: true },
};

export const WithCustomIcon: Story = {
  args: {
    icon: '🪙',
    title: 'No coins tracked',
    description: 'Add coins to your watchlist to track prices.',
    action: { label: 'Add coins', href: '/markets' },
  },
};

export const DarkBackground: Story = {
  args: { variant: 'error' },
  parameters: { backgrounds: { default: 'dark' } },
};
