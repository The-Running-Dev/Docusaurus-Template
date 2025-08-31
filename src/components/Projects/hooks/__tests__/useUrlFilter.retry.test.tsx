import React, { useEffect } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useUrlFilter } from '../useUrlFilter';

function RetryComp() {
  const { selectedFilter, setSelectedFilter } = useUrlFilter({ debounceMs: 0, maxRetries: 2 });
  useEffect(() => {
    setSelectedFilter('category-web');
  }, [setSelectedFilter]);
  return <div data-testid="filter">{selectedFilter}</div>;
}

describe('useUrlFilter retry path', () => {
  it('falls back to most-recent when history.replaceState keeps failing', async () => {
    vi.useFakeTimers();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const original = window.history.replaceState;
    // Throw on first 3 calls to exceed maxRetries
    // @ts-ignore
    window.history.replaceState = () => { throw new Error('fail'); };
    await act(async () => {
      render(<RetryComp />);
    });
    // Allow retry timers to run deterministically
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.getByTestId('filter').textContent).toBe('most-recent');
    window.history.replaceState = original;
    warnSpy.mockRestore();
    vi.useRealTimers();
  });
});
