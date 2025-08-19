import { ReactNode, useMemo } from 'react';
import {
  DataProvider,
  DataProviderProps,
  DataLoadingState
} from './DataProvider';

/**
 * JSON Data Provider configuration
 */
export interface JsonDataProviderProps extends DataProviderProps {
  /** JSON data to provide */
  data?: any;
}

export function JsonDataProvider({
  children,
  data,
  source
}: JsonDataProviderProps): ReactNode {
  // Static data doesn't have loading states since it's imported at build time
  const loadingState: DataLoadingState = useMemo(
    () => ({
      fetching: false,
      processing: false,
      loading: false,
      error: null
    }),
    []
  );

  const contextValue = useMemo(
    () => ({
      data,
      loadingState,
      refetch: undefined, // Static data can't be re-fetched
      resetError: undefined, // Static data doesn't have errors
      // Store useful metadata for debugging
      meta: {
        provider: 'JSON',
        source: 'static',
        location: source || 'default',
        timestamp: new Date().toISOString(),
        dataSize: data ? JSON.stringify(data).length : 0
      }
    }),
    [data, loadingState, source]
  );

  return <DataProvider value={contextValue}>{children}</DataProvider>;
}

export default JsonDataProvider;
