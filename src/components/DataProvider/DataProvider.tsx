import React, { useMemo } from 'react';
import { useFeaturesConfig, FeatureToConfigMap, Features } from '../../config/FeaturesConfig';

import JsonDataProvider from '../../context/JsonDataProvider';
import HttpDataProvider from '../../context/HttpDataProvider';

import { getData } from '../../data';
import { useDataContext } from '../../context/DataProvider';
import { DataProviderComponentProps } from './models';

// @ts-ignore
import { globalConfig as configData } from '../../../data';

function getProviderType(source: string): 'json' | 'http' {
  if (source?.startsWith('http://') || source?.startsWith('https://')) {
    return 'http';
  }

  return 'json';
}

/**
 * DataProvider - Provides data based on feature flags and configuration
 *
 * This component wraps the data fetching logic and provides a consistent interface
 * for consuming data in React components. It supports both static JSON data and
 * dynamic HTTP data sources.
 * 
 * Can also act as a simple FeatureGuard when no defaultData is provided.
 */
function DataProvider<TData = any, TProcessedData = TData>({
  feature,
  defaultData,
  processor,
  fallback = null,
  children
}: DataProviderComponentProps<
  TData,
  TProcessedData
>): React.ReactElement | null {
  const featuresConfig = useFeaturesConfig();
  const isEnabled = feature ? featuresConfig[FeatureToConfigMap[feature as Features]] : true;

  // Check if there's a configured data source (compute unconditionally for hook order)
  const dataConfig = useMemo(() => {
    if (!feature) {
      return null;
    }

    try {
      const globalConfigData = getData(configData);
      const configKey = FeatureToConfigMap[feature as Features];
      const featureConfig = globalConfigData[configKey];

      if (featureConfig?.source) {
        return {
          source: featureConfig.source,
          provider: getProviderType(featureConfig.source)
        };
      }
    } catch (error) {
      console.warn('Failed to Load Configuration, Using Default Data:', error);
    }

    return null;
  }, [feature]);

  // If feature is disabled, render fallback
  if (!isEnabled) {
    return fallback as React.ReactElement | null;
  }

  // Simple feature gating mode - when no defaultData provided, act like FeatureGuard
  const hasDefaultData = !(defaultData === undefined || defaultData === null);
  if (!hasDefaultData) {
    return <>{children(null as TProcessedData, false, null, null)}</>;
  }

  // If we have a configured data source, use appropriate provider
  if (dataConfig) {
    if (dataConfig.provider === 'http') {
      // Use HttpDataProvider for HTTP URLs
      return (
        <HttpDataProvider source={dataConfig.source} autoFetch={true}>
          <DataRenderer processor={processor}>{children}</DataRenderer>
        </HttpDataProvider>
      );
    } else {
      // Use JsonDataProvider for local file paths
      return (
        <JsonDataProvider data={defaultData} source={dataConfig.source}>
          <DataRenderer processor={processor}>{children}</DataRenderer>
        </JsonDataProvider>
      );
    }
  }

  // Fallback: use static data directly when no configuration exists
  const processedData =
    processor && defaultData ? processor(defaultData) : defaultData;

  const staticMeta = {
    provider: 'JSON',
    source: 'static',
    location: 'default',
    timestamp: new Date().toISOString(),
    dataSize: defaultData ? JSON.stringify(defaultData).length : 0
  };

  return (
    <>{children(processedData as TProcessedData, false, null, staticMeta)}</>
  );
}

interface DataRendererProps<TData, TProcessedData> {
  processor?: (data: TData) => TProcessedData;
  children: (
    data: TProcessedData,
    loading: boolean,
    error: Error | null,
    meta?: any
  ) => React.ReactNode;
}

function DataRenderer<TData = any, TProcessedData = TData>({
  processor,
  children
}: DataRendererProps<TData, TProcessedData>) {
  const context = useDataContext<TData>();

  const processedData =
    processor && context.data
      ? processor(context.data)
      : (context.data as unknown as TProcessedData);

  return (
    <>
      {children(
        processedData,
        context.loadingState.loading,
        context.loadingState.error,
        context.meta
      )}
    </>
  );
}

export default DataProvider;
