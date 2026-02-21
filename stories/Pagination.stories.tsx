import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../messages/en.json';
import { Pagination } from '../src/components/Pagination';

const withI18n = (Story: React.ComponentType) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <Story />
  </NextIntlClientProvider>
);

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  decorators: [withI18n],
  parameters: {
    layout: 'centered',
    nextjs: {
      navigation: {
        pathname: '/news',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    basePath: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    basePath: '/news',
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    basePath: '/news',
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    basePath: '/news',
  },
};

export const FewPages: Story = {
  name: 'Few pages (shows all)',
  args: {
    currentPage: 2,
    totalPages: 5,
    basePath: '/news',
  },
};

export const ManyPages: Story = {
  name: 'Many pages (100)',
  args: {
    currentPage: 50,
    totalPages: 100,
    basePath: '/search',
  },
};

export const TwoPages: Story = {
  name: 'Two pages only',
  args: {
    currentPage: 1,
    totalPages: 2,
    basePath: '/news',
  },
};

export const SinglePage: Story = {
  name: 'Single page (hidden)',
  args: {
    currentPage: 1,
    totalPages: 1,
    basePath: '/news',
  },
};

export const DarkBackground: Story = {
  args: {
    currentPage: 3,
    totalPages: 8,
    basePath: '/news',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
