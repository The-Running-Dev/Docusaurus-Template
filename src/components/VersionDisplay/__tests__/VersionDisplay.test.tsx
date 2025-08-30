import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock DataProvider to control states
const mockChildrenCalls: any[] = [];
vi.mock('../../DataProvider', () => ({
  __esModule: true,
  default: ({ children }: any) => {
    const [next] = mockChildrenCalls.splice(0, 1);
    if (next) return children(next.data, next.loading, next.error, next.meta);
    return children({ version: '9.9.9', prefix: 'v', badge: true }, false, null, {});
  }
}));

import VersionDisplay from '../VersionDisplay';

describe('VersionDisplay', () => {
  beforeEach(() => {
    mockChildrenCalls.length = 0;
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders loading state', () => {
    mockChildrenCalls.push({ data: null, loading: true, error: null, meta: null });
    render(<VersionDisplay />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error fallback version', () => {
    mockChildrenCalls.push({ data: null, loading: false, error: new Error('x'), meta: null });
    render(<VersionDisplay />);
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('renders linked version with badge when provided', () => {
    mockChildrenCalls.push({
      data: { version: '2.3.4', href: 'https://example.com', prefix: 'v', badge: true, className: 'extra' },
      loading: false,
      error: null,
      meta: null
    });
    render(<VersionDisplay />);
    const link = screen.getByRole('link', { name: 'v2.3.4' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link.className).toMatch(/version-display--badge/);
    expect(link.className).toMatch(/extra/);
  });

  it('renders default date-based version when no config', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
    mockChildrenCalls.push({ data: null, loading: false, error: null, meta: null });
    render(<VersionDisplay />);
    expect(screen.getByText('v2025.01.15')).toBeInTheDocument();
  });
});

