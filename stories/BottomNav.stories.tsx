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
import { BottomNav } from '../src/components/BottomNav';

const withI18n = (Story: React.ComponentType) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <Story />
  </NextIntlClientProvider>
);

const meta: Meta<typeof BottomNav> = {
  title: 'Components/BottomNav',
  component: BottomNav,
  decorators: [withI18n],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BottomNav>;

export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/en',
      },
    },
  },
};

export const MarketsActive: Story = {
  name: 'Markets tab active',
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/en/markets',
      },
    },
  },
};

export const TrendingActive: Story = {
  name: 'Trending tab active',
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/en/trending',
      },
    },
  },
};

export const SearchActive: Story = {
  name: 'Search tab active',
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/en/search',
      },
    },
  },
};

export const DarkBackground: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/en',
      },
    },
    backgrounds: { default: 'dark' },
  },
};
