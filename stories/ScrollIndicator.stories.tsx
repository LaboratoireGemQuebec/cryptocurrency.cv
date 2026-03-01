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
import { ScrollIndicator } from '../src/components/ScrollIndicator';

const mockTags = [
  'Bitcoin', 'Ethereum', 'Solana', 'DeFi', 'NFTs', 'Layer 2',
  'Regulation', 'Mining', 'Stablecoins', 'AI Crypto', 'Web3',
  'Metaverse', 'GameFi', 'DAOs', 'Privacy Coins', 'Derivatives',
];

const meta: Meta<typeof ScrollIndicator> = {
  title: 'Components/ScrollIndicator',
  component: ScrollIndicator,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    showArrows: { control: 'boolean' },
    arrowSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollIndicator>;

export const Default: Story = {
  args: {
    showArrows: true,
    arrowSize: 'md',
  },
  render: (args) => (
    <div style={{ maxWidth: '400px' }}>
      <ScrollIndicator {...args}>
        <div className="flex gap-2 p-2">
          {mockTags.map((tag) => (
            <span
              key={tag}
              className="whitespace-nowrap px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </ScrollIndicator>
    </div>
  ),
};

export const NoArrows: Story = {
  args: {
    showArrows: false,
  },
  render: (args) => (
    <div style={{ maxWidth: '400px' }}>
      <ScrollIndicator {...args}>
        <div className="flex gap-2 p-2">
          {mockTags.map((tag) => (
            <span
              key={tag}
              className="whitespace-nowrap px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </ScrollIndicator>
    </div>
  ),
};

export const SmallArrows: Story = {
  args: {
    showArrows: true,
    arrowSize: 'sm',
  },
  render: (args) => (
    <div style={{ maxWidth: '350px' }}>
      <ScrollIndicator {...args}>
        <div className="flex gap-2 p-2">
          {mockTags.map((tag) => (
            <span
              key={tag}
              className="whitespace-nowrap px-3 py-1 bg-orange-100 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </ScrollIndicator>
    </div>
  ),
};

export const DarkBackground: Story = {
  args: {
    showArrows: true,
    arrowSize: 'md',
  },
  render: (args) => (
    <div style={{ maxWidth: '400px' }}>
      <ScrollIndicator {...args}>
        <div className="flex gap-2 p-2">
          {mockTags.map((tag) => (
            <span
              key={tag}
              className="whitespace-nowrap px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </ScrollIndicator>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
