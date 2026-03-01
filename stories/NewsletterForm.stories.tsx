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
import { NewsletterForm } from '../src/components/NewsletterForm';

const meta: Meta<typeof NewsletterForm> = {
  title: 'Components/NewsletterForm',
  component: NewsletterForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  args: {
    variant: 'card',
  },
};

export const Inline: Story = {
  args: {
    variant: 'inline',
  },
};

export const Banner: Story = {
  args: {
    variant: 'banner',
  },
  parameters: {
    layout: 'fullscreen',
  },
};
