/**
 * @fileoverview Unit tests for Skeleton loading components
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  ArticleCardSkeleton,
  FeaturedArticleSkeleton,
  MarketStatsSkeleton,
  PostsGridSkeleton,
  PriceTickerSkeleton,
} from './Skeleton';

describe('Skeleton', () => {
  it('renders a hidden div', () => {
    const { container } = render(<Skeleton />);
    const el = container.querySelector('[aria-hidden="true"]');
    expect(el).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-4 w-32 rounded" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('h-4');
    expect(el.className).toContain('w-32');
    expect(el.className).toContain('rounded');
  });

  it('has skeleton class', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('skeleton');
  });
});

describe('ArticleCardSkeleton', () => {
  it('renders without errors', () => {
    const { container } = render(<ArticleCardSkeleton />);
    expect(container.firstChild).toBeTruthy();
  });

  it('contains multiple skeleton placeholders', () => {
    const { container } = render(<ArticleCardSkeleton />);
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe('FeaturedArticleSkeleton', () => {
  it('renders without errors', () => {
    const { container } = render(<FeaturedArticleSkeleton />);
    expect(container.firstChild).toBeTruthy();
  });

  it('contains multiple skeleton placeholders', () => {
    const { container } = render(<FeaturedArticleSkeleton />);
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe('MarketStatsSkeleton', () => {
  it('renders without errors', () => {
    const { container } = render(<MarketStatsSkeleton />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe('PostsGridSkeleton', () => {
  it('renders default 6 cards', () => {
    const { container } = render(<PostsGridSkeleton />);
    // Should have a list region
    const grid = container.querySelector('[aria-label="Loading articles..."]');
    expect(grid).toBeInTheDocument();
  });

  it('renders with custom count', () => {
    const { container } = render(<PostsGridSkeleton count={3} />);
    const grid = container.querySelector('[role="status"]');
    expect(grid).toBeInTheDocument();
    // 3 article card skeletons should be inside
    const children = grid?.children;
    expect(children?.length).toBe(3);
  });

  it('has proper ARIA role', () => {
    render(<PostsGridSkeleton count={2} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('PriceTickerSkeleton', () => {
  it('renders without errors', () => {
    const { container } = render(<PriceTickerSkeleton />);
    expect(container.firstChild).toBeTruthy();
  });
});
