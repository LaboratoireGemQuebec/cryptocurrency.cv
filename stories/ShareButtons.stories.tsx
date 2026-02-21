import type { Meta, StoryObj } from '@storybook/react';
import ShareButtons from '../src/components/ShareButtons';

const meta: Meta<typeof ShareButtons> = {
  title: 'Components/ShareButtons',
  component: ShareButtons,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    url: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ShareButtons>;

export const Default: Story = {
  args: {
    title: 'Bitcoin Surges Past $100K as Institutional Demand Soars',
    url: 'https://cryptocurrency.cv/article/bitcoin-100k',
  },
};

export const ShortTitle: Story = {
  args: {
    title: 'Bitcoin hits ATH',
    url: 'https://cryptocurrency.cv/article/btc-ath',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Federal Reserve Signals Potential Rate Cuts Amid Slowing Inflation, with Major Implications for Crypto Markets and Digital Asset Valuations',
    url: 'https://cryptocurrency.cv/article/fed-rate-cuts-crypto',
  },
};

export const DarkBackground: Story = {
  args: {
    title: 'Ethereum Upgrade Reduces Gas Fees by 90%',
    url: 'https://cryptocurrency.cv/article/eth-upgrade-gas',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
