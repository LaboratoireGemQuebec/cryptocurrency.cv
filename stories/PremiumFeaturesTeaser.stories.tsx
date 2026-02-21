import type { Meta, StoryObj } from '@storybook/react';
import { PremiumFeaturesTeaser } from '../src/components/PremiumFeaturesTeaser';

const meta: Meta<typeof PremiumFeaturesTeaser> = {
  title: 'Components/PremiumFeaturesTeaser',
  component: PremiumFeaturesTeaser,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PremiumFeaturesTeaser>;

export const Default: Story = {};

export const DarkBackground: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
