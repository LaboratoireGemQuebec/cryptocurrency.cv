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
import ReadingProgress from '../src/components/ReadingProgress';

const meta: Meta<typeof ReadingProgress> = {
  title: 'Components/ReadingProgress',
  component: ReadingProgress,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReadingProgress>;

/** The progress bar tracks scroll — to see it in action scroll within the story canvas */
export const Default: Story = {
  render: () => (
    <div>
      <ReadingProgress />
      <div style={{ padding: '20px' }}>
        <p style={{ color: '#888', fontSize: '12px' }}>
          ↑ Reading progress bar is pinned to the top of the viewport.
          Scroll this page to see it animate.
        </p>
        {Array.from({ length: 3 }, (_, i) => (
          <p key={i} style={{ margin: '20px 0', lineHeight: 1.7, color: '#333' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        ))}
      </div>
    </div>
  ),
};

export const WithCustomClass: Story = {
  args: {
    className: 'opacity-80',
  },
  render: (args) => (
    <div>
      <ReadingProgress {...args} />
      <div style={{ padding: '20px', color: '#888', fontSize: '12px' }}>
        Reading progress bar with custom className applied.
      </div>
    </div>
  ),
};

export const DarkBackground: Story = {
  render: () => (
    <div>
      <ReadingProgress />
      <div style={{ padding: '20px', color: '#aaa', fontSize: '12px' }}>
        Reading progress bar on dark background.
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
