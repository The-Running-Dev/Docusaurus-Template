import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DataMetadata {
  timestamp: number;
  source: string;
  size: number;
  [key: string]: any;
}

interface GenericDataStore {
  // Raw data storage by key
  data: Record<string, any>;

  // Loading states by key
  loading: Record<string, boolean>;

  // Errors by key
  errors: Record<string, Error | null>;

  // Metadata for debugging/caching
  metadata: Record<string, DataMetadata>;

  // Generic actions
  setData: (key: string, data: any, metadata?: Partial<DataMetadata>) => void;
  clearData: (key: string) => void;
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: Error | null) => void;

  // Generic queries
  getData: (key: string) => any;
  isLoading: (key: string) => boolean;
  getError: (key: string) => Error | null;
  hasData: (key: string) => boolean;
  getMetadata: (key: string) => DataMetadata | undefined;
}

export const useDataStore = create<GenericDataStore>()(
  devtools(
    (set, get) => ({
      data: {},
      loading: {},
      errors: {},
      metadata: {},

      setData: (key, data, metadata = {}) =>
        set(
          (state) => ({
            data: { ...state.data, [key]: data },
            errors: { ...state.errors, [key]: null }, // Clear error on successful data set
            metadata: {
              ...state.metadata,
              [key]: {
                timestamp: Date.now(),
                source: metadata.source || 'unknown',
                size: data ? JSON.stringify(data).length : 0,
                ...metadata
              }
            }
          }),
          false,
          `setData/${key}`
        ),

      clearData: (key) =>
        set(
          (state) => {
            const restData = { ...state.data };
            delete restData[key];
            const restLoading = { ...state.loading };
            delete restLoading[key];
            const restErrors = { ...state.errors };
            delete restErrors[key];
            const restMetadata = { ...state.metadata };
            delete restMetadata[key];

            return {
              data: restData,
              loading: restLoading,
              errors: restErrors,
              metadata: restMetadata
            };
          },
          false,
          `clearData/${key}`
        ),

      setLoading: (key, loading) =>
        set(
          (state) => ({
            loading: { ...state.loading, [key]: loading }
          }),
          false,
          `setLoading/${key}/${loading}`
        ),

      setError: (key, error) =>
        set(
          (state) => ({
            errors: { ...state.errors, [key]: error }
          }),
          false,
          `setError/${key}`
        ),

      getData: (key) => get().data[key],
      isLoading: (key) => get().loading[key] || false,
      getError: (key) => get().errors[key] || null,
      hasData: (key) => key in get().data && get().data[key] != null,
      getMetadata: (key) => get().metadata[key]
    }),
    {
      name: 'global-data-store'
    }
  )
);
