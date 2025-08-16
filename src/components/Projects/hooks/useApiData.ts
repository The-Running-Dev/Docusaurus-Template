import { useDataContext } from '../../../context/DataProvider';

/**
 * Hook to access API data from ApiDataProvider
 * This hook provides API data with consistent interface
 */
export function useApiData() {
  const context = useDataContext();

  return {
    data: context.data,
    loading: context.loadingState.loading,
    fetching: context.loadingState.fetching,
    processing: context.loadingState.processing,
    error: context.loadingState.error,
    refetch: context.refetch,
    resetError: context.resetError
  };
}

export default useApiData;
