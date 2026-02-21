import type { Meta, StoryObj } from '@storybook/react';
import RefreshButton from '../src/components/RefreshButton';

const meta: Meta<typeof RefreshButton> = {
  title: 'Components/RefreshButton',
  component: RefreshButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RefreshButton>;

export const Default: Story = {};

export const InErrorContext: Story = {
  name: 'In error context',
  render: () => (
    <div className="max-w-sm p-6 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 text-center space-y-4">
      <div className="text-4xl">⚠️</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Something went wrong
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Unable to load the latest news. Check your connection and try again.
      </p>
      <RefreshButton />
    </div>
  ),
};

export const DarkBackground: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
