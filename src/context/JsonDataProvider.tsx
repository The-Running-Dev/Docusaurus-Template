import { ReactNode, useMemo } from 'react';
import {
  DataProvider,
  DataProviderProps,
  DataLoadingState
} from './DataProvider';
import { DEFAULT_PROJECTS_LOCATION } from '../components/Projects';

// @ts-ignore
import { projects as staticProjectsData } from '../../data';

/**
 * JSON Data Provider configuration
 */
export interface JsonDataProviderProps extends DataProviderProps {
  /** Location of the JSON data - file path or static import identifier */
  location?: string;
}

/**
 * JSON Data Provider - provides static JSON data
 * This provider loads data from static JSON files
 */
export function JsonDataProvider({
  children,
  location = DEFAULT_PROJECTS_LOCATION
}: JsonDataProviderProps): ReactNode {
  // For JSON provider, we always use the static import since data is bundled at build time
  // The location parameter is used for configuration consistency and future extensibility

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
      data: staticProjectsData,
      loadingState,
      refetch: undefined, // Static data can't be re-fetched
      resetError: undefined, // Static data doesn't have errors
      // Store the location for reference/debugging
      meta: { location, provider: 'json' }
    }),
    [loadingState, location]
  );

  return <DataProvider value={contextValue}>{children}</DataProvider>;
}

export default JsonDataProvider;
