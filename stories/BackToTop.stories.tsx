import type { Meta, StoryObj } from '@storybook/react';
import { BackToTop } from '../src/components/BackToTop';

/**
 * BackToTop shows a floating scroll-to-top button with a circular progress
 * ring once the user has scrolled past the configured threshold.
 *
 * In Storybook the page is short so we force-show the button via CSS.
 */

const meta: Meta<typeof BackToTop> = {
  title: 'Components/BackToTop',
  component: BackToTop,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ minHeight: '120vh', padding: '2rem' }}>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Scroll down to see the button, or use the <strong>stories below</strong> that force it visible.
        </p>
        {/* Force-visible helper: override opacity/transform so we can see the button in canvas */}
        <style>{`
          button[aria-label="Scroll to top"] {
            opacity: 1 !important;
            transform: none !important;
            pointer-events: auto !important;
          }
        `}</style>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    threshold: { control: { type: 'range', min: 0, max: 1000, step: 50 }, description: 'Pixels before appearing' },
    smooth: { control: 'boolean', description: 'Smooth-scroll behaviour' },
    bottomOffset: { control: 'text', description: 'Fixed bottom position (CSS value)' },
    rightOffset: { control: 'text', description: 'Fixed right position (CSS value)' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    threshold: 0, // always show in Storybook
    smooth: true,
    bottomOffset: '6rem',
    rightOffset: '1.5rem',
  },
};

export const SmallThreshold: Story = {
  name: 'Always Visible (threshold 0)',
  args: {
    threshold: 0,
  },
};

export const BottomLeft: Story = {
  args: {
    threshold: 0,
    bottomOffset: '2rem',
    rightOffset: '90vw',
  },
};

export const NoSmoothScroll: Story = {
  args: {
    threshold: 0,
    smooth: false,
  },
};

export const DarkMode: Story = {
  args: { threshold: 0 },
  parameters: { backgrounds: { default: 'dark' } },
};

export const LightMode: Story = {
  args: { threshold: 0 },
  parameters: { backgrounds: { default: 'light' } },
};
