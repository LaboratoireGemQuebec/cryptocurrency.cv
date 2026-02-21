import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToastActions } from '../src/components/Toast';

/** A button that triggers toasts — needs to be inside ToastProvider */
function ToastTriggerButtons() {
  const { success, error, warning, info } = useToastActions();
  return (
    <div className="flex flex-wrap gap-3 p-8">
      <button
        onClick={() => success('Transaction confirmed', 'Your swap of 0.5 ETH was successful.')}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Success toast
      </button>
      <button
        onClick={() => error('Order failed', 'Insufficient liquidity for this trade.')}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Error toast
      </button>
      <button
        onClick={() => warning('Price impact high', 'This trade has a 5.2% price impact.')}
        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
      >
        Warning toast
      </button>
      <button
        onClick={() => info('Market update', 'Bitcoin just crossed $100,000.')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Info toast
      </button>
    </div>
  );
}

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/Toast',
  component: ToastProvider,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

export const Default: Story = {
  render: () => (
    <ToastProvider position="bottom-right">
      <ToastTriggerButtons />
    </ToastProvider>
  ),
};

export const TopRight: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <ToastTriggerButtons />
    </ToastProvider>
  ),
};

export const TopCenter: Story = {
  render: () => (
    <ToastProvider position="top-center">
      <ToastTriggerButtons />
    </ToastProvider>
  ),
};

export const BottomCenter: Story = {
  render: () => (
    <ToastProvider position="bottom-center">
      <ToastTriggerButtons />
    </ToastProvider>
  ),
};

export const DarkBackground: Story = {
  render: () => (
    <ToastProvider position="bottom-right">
      <ToastTriggerButtons />
    </ToastProvider>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
