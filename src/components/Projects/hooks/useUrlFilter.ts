import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef
} from 'react';

// Constants
const DEBOUNCE_DELAY = 200;
const MAX_RETRY_ATTEMPTS = 3;

// TypeScript interfaces
export interface FilterState {
  value: string;
  isLoading: boolean;
  error: string | null;
}

export interface FilterOptions {
  debounceMs?: number;
  maxRetries?: number;
  persistKey?: string;
}

export interface UseUrlFilterReturn {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for managing filter state with URL synchronization
 * Debounces URL updates for improved performance and better SPA behavior
 */
export function useUrlFilter(options: FilterOptions = {}): UseUrlFilterReturn {
  const { debounceMs = DEBOUNCE_DELAY, maxRetries = MAX_RETRY_ATTEMPTS, persistKey } = options;

  const [selectedFilter, setSelectedFilter] = useState('most-recent');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);
  const retryCountRef = useRef(0);

  // Initialize filter from URL params on mount (synchronous)
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || isInitializedRef.current) return;

    try {
      const filterParam = new URLSearchParams(window.location.search).get(
        'filter'
      );
      if (filterParam) {
        setSelectedFilter(filterParam);
      } else if (persistKey) {
        try {
          const saved = localStorage.getItem(persistKey);
          if (saved) setSelectedFilter(saved);
        } catch { /* ignore */ void 0; }
      }

      isInitializedRef.current = true;
      setError(null);
    } catch (err) {
      const errorMsg = `Failed to parse URL params: ${err}`;
      console.warn(errorMsg);
      setError(errorMsg);
      isInitializedRef.current = true;
    }
  }, [persistKey]);

  // Retry mechanism for URL operations
  const retryUrlOperation = useCallback(
    (operation: () => void, attemptCount = 0) => {
      try {
        operation();
        retryCountRef.current = 0;
        setError(null);
      } catch (err) {
        const errorMsg = `URL operation failed: ${err}`;
        console.warn(errorMsg);

        if (attemptCount < maxRetries) {
          setTimeout(
            () => retryUrlOperation(operation, attemptCount + 1),
            100 * (attemptCount + 1)
          );
        } else {
          setError(errorMsg);
          setSelectedFilter('most-recent'); // Fallback recovery
        }
      }
    },
    [maxRetries]
  );

  // Debounced URL update function
  const updateUrl = useCallback(
    (filter: string) => {
      if (typeof window === 'undefined' || !isInitializedRef.current) return;

      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      setIsLoading(true);

      // Debounce URL updates to prevent excessive history entries
      debounceTimeoutRef.current = setTimeout(() => {
        const urlOperation = () => {
          const url = new URL(window.location.href);
          const desired = filter && filter !== 'most-recent' ? filter : null;
          const current = url.searchParams.get('filter') ?? null;

          // No-op if already matches to avoid redundant history updates
          if (current === desired) {
            setIsLoading(false);
            return;
          }

          if (desired) {
            url.searchParams.set('filter', desired.toLowerCase());
          } else {
            url.searchParams.delete('filter');
          }

          const newUrl = url.pathname + (url.search ? url.search : '');

          // Only update if the URL actually changed
          if (window.location.pathname + window.location.search !== newUrl) {
            window.history.replaceState(
              { ...window.history.state, filter },
              '',
              newUrl
            );
          }

          setIsLoading(false);
        };

        retryUrlOperation(urlOperation);
      }, debounceMs);
    },
    [debounceMs, retryUrlOperation]
  );

  // Update URL when filter changes (debounced)
  useEffect(() => {
    updateUrl(selectedFilter);
    // Persist selection
    if (persistKey && typeof window !== 'undefined') {
      try {
        if (selectedFilter && selectedFilter !== 'most-recent') {
          localStorage.setItem(persistKey, selectedFilter);
        } else {
          localStorage.removeItem(persistKey);
        }
      } catch { /* ignore */ void 0; }
    }
  }, [selectedFilter, updateUrl, persistKey]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle browser back/forward navigation
  const selectedFilterRef = useRef(selectedFilter);
  useEffect(() => {
    selectedFilterRef.current = selectedFilter;
  }, [selectedFilter]);

  const handlePopState = useCallback(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const filterParam = urlParams.get('filter') || 'most-recent';

      if (filterParam !== selectedFilterRef.current) {
        setSelectedFilter(filterParam);
        setError(null);
      }
    } catch (err) {
      const errorMsg = `Failed to handle popstate: ${err}`;
      console.warn(errorMsg);
      setError(errorMsg);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handlePopState]);

  return {
    selectedFilter,
    setSelectedFilter,
    isLoading,
    error
  };
}
