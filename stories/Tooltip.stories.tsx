import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '../src/components/Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    delay: { control: { type: 'range', min: 0, max: 1000, step: 100 } },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'This is a helpful tooltip',
    position: 'top',
    delay: 200,
  },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
        Hover me (top)
      </button>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  args: {
    content: 'Tooltip appears below',
    position: 'bottom',
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
        Hover me (bottom)
      </button>
    </Tooltip>
  ),
};

export const Left: Story = {
  args: {
    content: 'Left side tooltip',
    position: 'left',
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">
        Hover me (left)
      </button>
    </Tooltip>
  ),
};

export const Right: Story = {
  args: {
    content: 'Right side tooltip',
    position: 'right',
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">
        Hover me (right)
      </button>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  args: {
    content: 'This tooltip contains a much longer explanation that wraps across multiple lines to demonstrate how it handles longer text content.',
    position: 'top',
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 bg-gray-700 text-white rounded-lg">
        Long tooltip
      </button>
    </Tooltip>
  ),
};

export const DarkBackground: Story = {
  args: {
    content: 'Dark mode tooltip',
    position: 'top',
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 bg-slate-600 text-white rounded-lg">
        Hover me
      </button>
    </Tooltip>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
