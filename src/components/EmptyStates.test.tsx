/**
 * @fileoverview Unit tests for EmptyStates components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Must be before component import
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => React.createElement('a', { href, ...props }, children),
}));

// Mock window.location.reload for EmptyNews/DataError/OfflineState
const mockReload = vi.fn();
vi.stubGlobal('location', { ...window.location, reload: mockReload });

import {
  EmptyState,
  EmptyWatchlist,
  EmptyPortfolio,
  EmptyAlerts,
  EmptyBookmarks,
  EmptySearch,
  EmptyTransactions,
  EmptyCompare,
  EmptyNews,
  DataError,
  RateLimitError,
  OfflineState,
} from './EmptyStates';

describe('EmptyState (base component)', () => {
  it('renders title and description', () => {
    render(<EmptyState title="Test Title" description="Test description" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <EmptyState
        title="T"
        description="D"
        icon={<span data-testid="icon">⭐</span>}
      />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action link when href provided', () => {
    render(<EmptyState title="T" description="D" action={{ label: 'Go home', href: '/' }} />);
    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link.getAttribute('href')).toBe('/');
  });

  it('renders action button when onClick provided', () => {
    const mockClick = vi.fn();
    render(<EmptyState title="T" description="D" action={{ label: 'Click me', onClick: mockClick }} />);
    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('renders secondary action when provided', () => {
    render(
      <EmptyState
        title="T"
        description="D"
        action={{ label: 'Primary', href: '/primary' }}
        secondaryAction={{ label: 'Secondary', href: '/secondary' }}
      />
    );
    expect(screen.getByRole('link', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Secondary' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <EmptyState title="T" description="D" className="custom-class" />
    );
    expect((container.firstChild as HTMLElement).className).toContain('custom-class');
  });
});

describe('EmptyWatchlist', () => {
  it('renders watchlist empty message', () => {
    render(<EmptyWatchlist />);
    expect(screen.getByText('Your watchlist is empty')).toBeInTheDocument();
  });

  it('renders Browse Coins link to /trending', () => {
    render(<EmptyWatchlist />);
    const link = screen.getByRole('link', { name: 'Browse Coins' });
    expect(link.getAttribute('href')).toBe('/trending');
  });

  it('renders Explore Markets button when onBrowse provided', () => {
    const mockBrowse = vi.fn();
    render(<EmptyWatchlist onBrowse={mockBrowse} />);
    const button = screen.getByRole('button', { name: 'Explore Markets' });
    fireEvent.click(button);
    expect(mockBrowse).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyPortfolio', () => {
  it('renders portfolio empty message', () => {
    render(<EmptyPortfolio />);
    expect(screen.getByText('No holdings yet')).toBeInTheDocument();
  });

  it('renders Import Portfolio link', () => {
    render(<EmptyPortfolio />);
    const link = screen.getByRole('link', { name: 'Import Portfolio' });
    expect(link.getAttribute('href')).toContain('/portfolio');
  });

  it('renders Add Holding button when onAdd provided', () => {
    const mockAdd = vi.fn();
    render(<EmptyPortfolio onAdd={mockAdd} />);
    const button = screen.getByRole('button', { name: 'Add Holding' });
    fireEvent.click(button);
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyAlerts', () => {
  it('renders no price alerts message', () => {
    render(<EmptyAlerts />);
    expect(screen.getByText('No price alerts')).toBeInTheDocument();
  });

  it('renders Create Alert button when onAdd provided', () => {
    const mockAdd = vi.fn();
    render(<EmptyAlerts onAdd={mockAdd} />);
    fireEvent.click(screen.getByRole('button', { name: 'Create Alert' }));
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });

  it('renders Browse Coins link when no onAdd (default)', () => {
    render(<EmptyAlerts />);
    const link = screen.getByRole('link', { name: 'Browse Coins' });
    expect(link.getAttribute('href')).toBe('/trending');
  });
});

describe('EmptyBookmarks', () => {
  it('renders no bookmarked articles message', () => {
    render(<EmptyBookmarks />);
    expect(screen.getByText('No bookmarked articles')).toBeInTheDocument();
  });

  it('renders Browse News link to /', () => {
    render(<EmptyBookmarks />);
    const link = screen.getByRole('link', { name: 'Browse News' });
    expect(link.getAttribute('href')).toBe('/');
  });
});

describe('EmptySearch', () => {
  it('renders no results message with query', () => {
    render(<EmptySearch query="ethereum merge" />);
    expect(screen.getByText('No results for "ethereum merge"')).toBeInTheDocument();
  });

  it('renders View Trending link', () => {
    render(<EmptySearch query="test" />);
    const link = screen.getByRole('link', { name: 'View Trending' });
    expect(link.getAttribute('href')).toBe('/trending');
  });
});

describe('EmptyTransactions', () => {
  it('renders no transactions message', () => {
    render(<EmptyTransactions />);
    expect(screen.getByText('No transactions')).toBeInTheDocument();
  });
});

describe('EmptyCompare', () => {
  it('renders compare cryptocurrencies heading', () => {
    render(<EmptyCompare />);
    expect(screen.getByText('Compare Cryptocurrencies')).toBeInTheDocument();
  });

  it('renders Add Coin button when onAdd provided', () => {
    const mockAdd = vi.fn();
    render(<EmptyCompare onAdd={mockAdd} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add Coin' }));
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });

  it('renders Browse Coins link when no onAdd', () => {
    render(<EmptyCompare />);
    const link = screen.getByRole('link', { name: 'Browse Coins' });
    expect(link.getAttribute('href')).toBe('/trending');
  });
});

describe('EmptyNews', () => {
  it('renders no news available message', () => {
    render(<EmptyNews />);
    expect(screen.getByText('No news available')).toBeInTheDocument();
  });

  it('renders Refresh button', () => {
    render(<EmptyNews />);
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });
});

describe('DataError', () => {
  it('renders failed to load data message', () => {
    render(<DataError />);
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('renders Try Again button when onRetry provided', () => {
    const mockRetry = vi.fn();
    render(<DataError onRetry={mockRetry} />);
    const button = screen.getByRole('button', { name: 'Try Again' });
    fireEvent.click(button);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('renders Refresh Page button when no onRetry', () => {
    render(<DataError />);
    expect(screen.getByRole('button', { name: 'Refresh Page' })).toBeInTheDocument();
  });
});

describe('RateLimitError', () => {
  it('renders too many requests message', () => {
    render(<RateLimitError />);
    expect(screen.getByText('Too many requests')).toBeInTheDocument();
  });

  it('shows retry-after seconds in description when provided', () => {
    render(<RateLimitError retryAfter={60} />);
    expect(screen.getByText('Please wait 60 seconds before trying again.')).toBeInTheDocument();
  });
});

describe('OfflineState', () => {
  it("renders you're offline message", () => {
    render(<OfflineState />);
    expect(screen.getByText("You're offline")).toBeInTheDocument();
  });

  it('renders Retry button', () => {
    render(<OfflineState />);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});
