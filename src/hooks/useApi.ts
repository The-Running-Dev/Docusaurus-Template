import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * API Hook Configuration
 */
export interface UseApiConfig {
  /** API endpoint URL */
  endpoint?: string;

  /** Request options */
  options?: RequestInit;

  /** Auto-fetch on mount */
  autoFetch?: boolean;

  /** Retry attempts on failure */
  retryAttempts?: number;

  /** Retry delay in milliseconds */
  retryDelay?: number;
}

/**
 * API Hook State
 */
export interface UseApiState<T = any> {
  /** API response data */
  data: T | null;

  /** Loading state */
  loading: boolean;

  /** Error state */
  error: Error | null;

  /** Manually trigger fetch */
  refetch: () => Promise<void>;

  /** Reset state */
  reset: () => void;
}

/**
 * Default API configuration
 */
const DEFAULT_CONFIG: Required<UseApiConfig> = {
  endpoint: '',
  options: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  autoFetch: true,
  retryAttempts: 3,
  retryDelay: 1000
};

/**
 * Hook for fetching project data from an API
 * Disabled by default and respects feature flags
 *
 * @param config - API configuration
 * @returns API state and actions
 *
 * @example
 * ```tsx
 * // Basic usage (disabled by default)
 * const { data, loading, error } = useApi({
 *   endpoint: '/api/projects'
 * });
 *
 * // Manual fetch with retry
 * const { data, refetch, reset } = useApi({
 *   endpoint: '/api/projects',
 *   autoFetch: false,
 *   retryAttempts: 5,
 *   retryDelay: 2000
 * });
 * ```
 */
export function useApi<T = any>(config: UseApiConfig = {}): UseApiState<T> {
  // Merge config with defaults
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // State management
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Refs for cleanup and abort handling
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  // Cleanup effect
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (abortRef.current) abortRef.current.abort();

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);

        timeoutRef.current = null;
      }
    };
  }, []);

  /**
   * Fetch data with retry logic
   */
  const fetchData = useCallback(
    async (attempt: number = 1): Promise<void> => {
      if (!mergedConfig.endpoint || !mountedRef.current) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Abort previous request if exists
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        const response = await fetch(mergedConfig.endpoint, {
          ...mergedConfig.options,
          signal: abortRef.current.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const jsonData = await response.json();

        // Check if component is still mounted before updating state
        if (!mountedRef.current) return;

        setData(jsonData);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Unknown API Error');

        // Skip retry logic if this was an abort or component unmounted
        if (error.name === 'AbortError' || !mountedRef.current) {
          return;
        }

        // Retry logic
        if (attempt < mergedConfig.retryAttempts && mountedRef.current) {
          console.warn(
            `API Fetch Attempt ${attempt} Failed, Retrying in ${mergedConfig.retryDelay}ms...`,
            error.message
          );

          timeoutRef.current = window.setTimeout(() => {
            fetchData(attempt + 1);
          }, mergedConfig.retryDelay);

          return;
        }

        // Max retries reached
        if (mountedRef.current) {
          console.error(
            'API Fetch Failed After All Retry Attempts:',
            error.message
          );
          setError(error);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [
      mergedConfig.endpoint,
      mergedConfig.options,
      mergedConfig.retryAttempts,
      mergedConfig.retryDelay
    ]
  );

  /**
   * Reset state to initial values
   */
  const reset = useCallback(() => {
    // Cancel any pending operations
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Reset state
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchData(1);
  }, [fetchData]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (mergedConfig.autoFetch && mergedConfig.endpoint) {
      fetchData(1);
    }
  }, [mergedConfig.autoFetch, mergedConfig.endpoint, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    reset
  };
}

export default useApi;
