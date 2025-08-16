import { useDataContext } from '../../../context/DataProvider';

/**
 * Hook to access JSON data from JsonDataProvider
 * This hook provides static JSON data with consistent interface
 */
export function useJsonData() {
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

export default useJsonData;
