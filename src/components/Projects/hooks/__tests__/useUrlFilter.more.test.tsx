import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useUrlFilter } from '../useUrlFilter';

function Comp() {
  const { selectedFilter } = useUrlFilter({ debounceMs: 0 });
  return <div data-testid="filter">{selectedFilter}</div>;
}

describe('useUrlFilter popstate + init', () => {
  it('initializes from URL and updates on popstate', async () => {
    window.history.replaceState({}, '', '/projects?filter=category-web');
    render(<Comp />);
    expect(screen.getByTestId('filter').textContent?.toLowerCase()).toBe('category-web');
    // change URL and dispatch popstate
    await act(async () => {
      window.history.replaceState({}, '', '/projects?filter=tag-react');
      window.dispatchEvent(new PopStateEvent('popstate'));
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(screen.getByTestId('filter').textContent?.toLowerCase()).toBe('tag-react');
  });
});
