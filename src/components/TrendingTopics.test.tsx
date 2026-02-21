/**
 * @fileoverview Unit tests for TrendingTopics component
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import TrendingTopics from './TrendingTopics';

const mockTopics = [
  { name: 'Bitcoin ETF', slug: 'bitcoin-etf', count: 24 },
  { name: 'Ethereum', slug: 'ethereum', count: 18 },
  { name: 'DeFi', slug: 'defi', count: 15 },
];

describe('TrendingTopics', () => {
  it('renders the section heading', () => {
    render(<TrendingTopics topics={mockTopics} />);
    expect(screen.getByText(/Trending Topics/i)).toBeInTheDocument();
  });

  it('renders all provided topics', () => {
    render(<TrendingTopics topics={mockTopics} />);
    expect(screen.getByText('Bitcoin ETF')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('DeFi')).toBeInTheDocument();
  });

  it('renders correct article counts', () => {
    render(<TrendingTopics topics={mockTopics} />);
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders links with correct hrefs', () => {
    render(<TrendingTopics topics={mockTopics} />);
    const btcLink = screen.getByRole('link', { name: /Bitcoin ETF/ });
    expect(btcLink).toHaveAttribute('href', '/topic/bitcoin-etf');

    const ethLink = screen.getByRole('link', { name: /Ethereum/ });
    expect(ethLink).toHaveAttribute('href', '/topic/ethereum');
  });

  it('renders rank numbers starting from 1', () => {
    render(<TrendingTopics topics={mockTopics} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders "View all" link', () => {
    render(<TrendingTopics topics={mockTopics} />);
    const viewAll = screen.getByRole('link', { name: /view all/i });
    expect(viewAll).toBeInTheDocument();
    expect(viewAll).toHaveAttribute('href', '/topics');
  });

  it('renders default built-in topics when none provided', () => {
    render(<TrendingTopics />);
    // Should render without crashing and show the heading
    expect(screen.getByText(/Trending Topics/i)).toBeInTheDocument();
    // Default topics include Bitcoin ETF
    expect(screen.getByText('Bitcoin ETF')).toBeInTheDocument();
  });

  it('renders single topic correctly', () => {
    const single = [{ name: 'Solana', slug: 'solana', count: 99 }];
    render(<TrendingTopics topics={single} />);
    expect(screen.getByText('Solana')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('renders large count correctly', () => {
    const big = [{ name: 'Big Topic', slug: 'big', count: 9999 }];
    render(<TrendingTopics topics={big} />);
    expect(screen.getByText('9999')).toBeInTheDocument();
  });
});
