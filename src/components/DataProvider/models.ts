import React from 'react';
import { Features } from '../../config/FeaturesConfig';

export interface DataProviderComponentProps<TData, TProcessedData = TData> {
  feature?: Features;
  defaultData?: TData;
  processor?: (data: TData) => TProcessedData;
  fallback?: React.ReactNode;
  children: (
    data: TProcessedData,
    loading: boolean,
    error: Error | null,
    meta?: any
  ) => React.ReactNode;
}
