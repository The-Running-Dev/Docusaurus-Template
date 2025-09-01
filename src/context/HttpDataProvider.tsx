import React, {
  ReactNode,
  useMemo,
  useCallback,
  useState,
  useEffect
} from 'react';
import {
  DataProvider,
  DataProviderProps,
  DataLoadingState
} from './DataProvider';

/**
 * Simple API response cache for data providers
 */
interface CacheEntry {
  data: any;
  timestamp: number;
}

const apiDataCache = new Map<string, CacheEntry>();
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * API Data Provider configuration
 */
export interface HttpDataProviderProps extends DataProviderProps {
  /** Additional request options */
  options?: RequestInit;

  /** Auto-fetch on mount */
  autoFetch?: boolean;

  /** Retry attempts */
  retryAttempts?: number;

  /** Retry delay in milliseconds */
  retryDelay?: number;

  /** Enable caching of API responses */
  enableCache?: boolean;

  /** Cache duration in milliseconds */
  cacheDuration?: number;
}

/**
 * API Data Provider - provides data from API endpoints
 * This provider fetches data from REST APIs with built-in caching
 */
export function HttpDataProvider({
  children,
  source,
  options,
  autoFetch = true,
  enableCache = true,
  cacheDuration = DEFAULT_CACHE_DURATION
}: HttpDataProviderProps): ReactNode {
  // Construct API URL with query parameters
  const apiUrl = useMemo(() => {
    try {
      if (!source) {
        throw new Error('Missing Data Source URL');
      }

      const url = new URL(source);

      return url.toString();
    } catch (e) {
      console.error('Invalid HTTP Data Source:', e);

      return '';
    }
  }, [source]);
  // Check cache before making API call
  const getCachedData = useCallback(() => {
    if (!enableCache) return null;

    const cached = apiDataCache.get(apiUrl);

    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      return cached.data;
    }

    return null;
  }, [apiUrl, enableCache, cacheDuration]);

  // Cache API response
  const setCacheData = useCallback(
    (data: any) => {
      if (enableCache) {
        apiDataCache.set(apiUrl, {
          data,
          timestamp: Date.now()
        });

        // Prevent cache from growing too large
        if (apiDataCache.size > 50) {
          const firstKey = apiDataCache.keys().next().value;

          if (firstKey) {
            apiDataCache.delete(firstKey);
          }
        }
      }
    },
    [apiUrl, enableCache]
  );

  // State management
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data with caching
  const fetchData = useCallback(async () => {
    if (!apiUrl) return;

    // Check cache first
    const cachedData = getCachedData();

    if (cachedData) {
      setData(cachedData);
      setLoading(false);

      return;
    }

    // No cache hit, fetch from API
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const jsonData = await response.json();

      // Cache the response
      setCacheData(jsonData);
      setData(jsonData);
    } catch (err) {
      const fetchError =
        err instanceof Error ? err : new Error('Unknown API error');

      setError(fetchError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, options, getCachedData, setCacheData]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Manual refetch function
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Reset error function
  const reset = useCallback(() => {
    setError(null);
  }, []);

  // Transform API response to raw data
  const rawData = useMemo(() => {
    if (!data) return null;

    // Handle different API response formats
    if (data.success && data.data) {
      return data.data; // Standard API response format
    }

    if (Array.isArray(data)) {
      return data; // Direct array response
    }

    return data; // Raw response
  }, [data]);

  // Create loading state
  const loadingState: DataLoadingState = useMemo(
    () => ({
      fetching: loading,
      processing: false, // API provider only handles fetching
      loading: loading,
      error
    }),
    [loading, error]
  );

  // Refetch function
  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Reset error function
  const handleResetError = useCallback(() => {
    reset();
  }, [reset]);

  const contextValue = useMemo(
    () => ({
      data: rawData,
      loadingState,
      refetch: handleRefetch,
      resetError: handleResetError,
      meta: {
        provider: 'HTTP',
        source: 'api',
        endpoint: apiUrl,
        cached: !!getCachedData(),
        timestamp: new Date().toISOString(),
        dataSize: rawData ? JSON.stringify(rawData).length : 0
      }
    }),
    [rawData, loadingState, handleRefetch, handleResetError, apiUrl, getCachedData]
  );

  return <DataProvider value={contextValue}>{children}</DataProvider>;
}

export default HttpDataProvider;
