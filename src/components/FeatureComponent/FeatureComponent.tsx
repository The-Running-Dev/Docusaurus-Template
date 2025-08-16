import React from 'react';
import { getData } from '../../data';
import { Features, useFeatureFlag } from '../../config/FeaturesConfig';

/**
 * Props for the base feature component
 */
export interface FeatureComponentProps<TConfig, TProcessedData> {
  /** Feature flag to check */
  feature: Features;

  /** Raw configuration data */
  configData: any;

  /** Optional data processor function */
  processor?: (config: TConfig) => TProcessedData;

  /** Render function that receives the processed data */
  children: (data: TProcessedData) => React.ReactNode;
}

/**
 * Base component that handles feature flag checking and data loading
 *
 * This component abstracts the common pattern of:
 * 1. Checking if a feature is enabled
 * 2. Loading and optionally processing configuration data
 * 3. Rendering only if the feature is enabled
 *
 * @example
 * ```tsx
 * <FeatureComponent
 *   feature={Features.VersionDisplay}
 *   configData={versionConfigData}
 *   processor={(config) => ({ ...config, computedValue: process(config) })}
 * >
 *   {(data) => <div>{data.version}</div>}
 * </FeatureComponent>
 * ```
 */
function FeatureComponent<TConfig = any, TProcessedData = TConfig>({
  feature,
  configData,
  processor,
  children
}: FeatureComponentProps<TConfig, TProcessedData>): React.ReactElement | null {
  const isEnabled = useFeatureFlag(feature);

  if (!isEnabled) {
    return null;
  }

  // Load and optionally process the configuration data
  const data = getData<TConfig>(configData);
  const processedData = processor
    ? processor(data)
    : (data as unknown as TProcessedData);

  return <>{children(processedData)}</>;
}

export default FeatureComponent;
