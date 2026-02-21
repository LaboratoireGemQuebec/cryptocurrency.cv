/**
 * @fileoverview Unit tests for RefreshButton component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RefreshButton from './RefreshButton';

describe('RefreshButton', () => {
  const mockReload = vi.fn();

  beforeEach(() => {
    // vi.stubGlobal bypasses jsdom's non-configurable window.location restriction
    vi.stubGlobal('location', { ...window.location, reload: mockReload });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('renders a button', () => {
    render(<RefreshButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('shows "Try Again" text', () => {
    render(<RefreshButton />);
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('calls window.location.reload on click', () => {
    render(<RefreshButton />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('renders reload icon (SVG)', () => {
    const { container } = render(<RefreshButton />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has full-width button style', () => {
    const { container } = render(<RefreshButton />);
    const button = container.querySelector('button');
    expect(button?.className).toContain('w-full');
  });
});
