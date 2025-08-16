import { createContext, useContext, ReactNode } from 'react';

/**
 * Data source loading states
 */
export interface DataLoadingState {
  /** Data is being fetched from source */
  fetching: boolean;

  /** Data is being processed/transformed */
  processing: boolean;

  /** Overall loading state */
  loading: boolean;

  /** Error from data source */
  error: Error | null;
}

/**
 * Data context value
 */
export interface DataContextValue<T = any> {
  /** Raw data from the source */
  data: T | null;

  /** Loading states */
  loadingState: DataLoadingState;

  /** Refetch data from source */
  refetch?: () => Promise<void>;

  /** Reset error state */
  resetError?: () => void;

  /** Optional metadata about the data source */
  meta?: {
    location?: string;
    provider?: string;
    [key: string]: any;
  };
}

/**
 * Data context
 */
const DataContext = createContext<DataContextValue | null>(null);

/**
 * Hook to access data context
 */
export function useDataContext<T = any>(): DataContextValue<T> {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useDataContext Must be Used within a DataProvider');
  }

  return context as DataContextValue<T>;
}

/**
 * Base data provider props
 */
export interface DataProviderProps {
  children: ReactNode;
}

/**
 * Base data provider component
 */
export function DataProvider<T = any>({
  children,
  value
}: DataProviderProps & { value: DataContextValue<T> }): ReactNode {
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export default DataProvider;
