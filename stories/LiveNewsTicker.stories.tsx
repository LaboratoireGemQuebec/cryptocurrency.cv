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
import { LiveNewsTicker } from '../src/components/LiveNewsTicker';

const withI18n = (Story: React.ComponentType) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <Story />
  </NextIntlClientProvider>
);

const meta: Meta<typeof LiveNewsTicker> = {
  title: 'Components/LiveNewsTicker',
  component: LiveNewsTicker,
  decorators: [withI18n],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/en',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LiveNewsTicker>;

/** The ticker connects to SSE /api/sse — in Storybook it will show disconnected/empty state */
export const Default: Story = {};

export const DarkBackground: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
