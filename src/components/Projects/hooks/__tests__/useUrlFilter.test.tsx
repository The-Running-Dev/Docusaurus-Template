import React, { useEffect } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useUrlFilter } from '../../hooks/useUrlFilter';

function TestComp() {
  const { selectedFilter, setSelectedFilter, isLoading, error } = useUrlFilter({ debounceMs: 10 });
  useEffect(() => {
    // trigger one update
    setSelectedFilter('Category-Web');
  }, [setSelectedFilter]);
  return (
    <div>
      <span data-testid="filter">{selectedFilter}</span>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="error">{error || ''}</span>
    </div>
  );
}

describe('useUrlFilter', () => {
  it('updates URL with debounce after setting filter', async () => {
    vi.useFakeTimers();
    const url = new URL('https://example.com/projects?filter=Most-Recent');
    window.history.replaceState({}, '', url.pathname + url.search);

    render(<TestComp />);
    // advance debounce to apply update to URL
    await act(async () => {
      vi.advanceTimersByTime(15);
    });
    expect(window.location.search).toContain('filter=category-web');
    // component state should reflect last set value
    expect(screen.getByTestId('filter').textContent).toBe('Category-Web');
    vi.useRealTimers();
  });
});
