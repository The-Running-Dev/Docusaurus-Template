import React from 'react';
import { Features } from '../../config/FeaturesConfig';

export interface DataComponentProps<TData, TProcessedData = TData> {
  feature: Features;
  defaultData: TData;
  processor?: (data: TData) => TProcessedData;
  children: (
    data: TProcessedData,
    loading: boolean,
    error: Error | null,
    meta?: any
  ) => React.ReactNode;
}

