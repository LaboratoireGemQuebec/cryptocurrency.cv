import type { Meta, StoryObj } from '@storybook/react';
import { TrendingNarratives } from '../src/components/TrendingNarratives';

const meta: Meta<typeof TrendingNarratives> = {
  title: 'Components/TrendingNarratives',
  component: TrendingNarratives,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TrendingNarratives>;

export const Default: Story = {};

export const DarkBackground: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
