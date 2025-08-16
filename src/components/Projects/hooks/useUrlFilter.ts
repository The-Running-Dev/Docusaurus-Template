import { useState, useEffect } from 'react';

/**
 * Custom hook for managing filter state with URL synchronization
 * Handles reading filter from URL params on load and updating URL when filter changes
 */
export function useUrlFilter() {
  const [selectedFilter, setSelectedFilter] = useState('most-recent');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');

    if (filterParam) {
      setSelectedFilter(filterParam);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const current = url.searchParams.get('filter') ?? null;
    const desired =
      selectedFilter && selectedFilter !== 'most-recent'
        ? selectedFilter
        : null;

    // No-op if already matches to avoid redundant history updates
    if (current === desired) return;

    if (desired) {
      url.searchParams.set('filter', desired);
    } else {
      url.searchParams.delete('filter');
    }

    window.history.replaceState(null, '', url.toString());
  }, [selectedFilter]);

  return [selectedFilter, setSelectedFilter] as const;
}
