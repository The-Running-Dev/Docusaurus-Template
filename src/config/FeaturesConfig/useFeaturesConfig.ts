import { useMemo } from 'react';

import { getData } from '../../data/dataLoader';
import {
  Features,
  FeaturesConfig,
  validateFeaturesConfig,
  FeatureToConfigMap
} from './models';

// @ts-ignore
import { globalConfig as configData } from '../../../data';

/**
 * Features Configuration Hook
 *
 * Provides type-safe, validated access to feature flags in React components.
 * Features include:
 * - Type safety with FeaturesConfig interface
 * - Runtime validation of configuration data
 * - Memoized for performance (prevents unnecessary re-renders)
 * - Centralized error handling
 * - Easy testing and mocking support
 *
 * @returns Validated FeaturesConfig object
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const features = useFeaturesConfig();
 *
 *   if (!features.enableMyFeature) {
 *     return null;
 *   }
 *
 *   return <div>Feature is enabled!</div>;
 * }
 * ```
 */
export function useFeaturesConfig(): FeaturesConfig {
  return useMemo(() => {
    try {
      const globalConfig = getData(configData);
      const config = globalConfig.features as FeaturesConfig;

      // Validate the configuration to ensure type safety at runtime
      validateFeaturesConfig(config);

      return config;
    } catch (error) {
      console.error(
        'Failed to Load or Validate Features Configuration:',
        error
      );

      // Provide helpful error message for developers
      throw new Error(
        `Features Configuration Failed to Load: ${error instanceof Error ? error.message : 'Unknown error'}\n` +
          'Please Check That globalConfig.json Features Section Exists and Has All Boolean Fields.'
      );
    }
  }, []); // Empty dependency array since config is static
}

/**
 * Hook to check if a specific feature is enabled
 * Supports both enum values and string keys for maximum flexibility
 *
 * @param feature - Feature enum value or config key string
 * @returns Boolean indicating if the feature is enabled
 *
 * @example
 * ```tsx
 * // Using enum (recommended for type safety)
 * function ConditionalComponent() {
 *   const isEnabled = useFeatureFlag(Features.EnableGitHubLinks);
 *   return isEnabled ? <GitHubLinks /> : null;
 * }
 *
 * // Using string key (also supported)
 * function ConditionalComponent() {
 *   const isEnabled = useFeatureFlag('enableGitHubLinks');
 *   return isEnabled ? <GitHubLinks /> : null;
 * }
 * ```
 */

// Function overloads
export function useFeatureFlag(feature: Features): boolean;
export function useFeatureFlag<T extends keyof FeaturesConfig>(
  feature: T
): boolean;

// Implementation
export function useFeatureFlag(
  feature: Features | keyof FeaturesConfig
): boolean {
  const config = useFeaturesConfig();

  // If it's an enum value, map it to the config key
  if (typeof feature === 'number' && feature in FeatureToConfigMap) {
    const configKey = FeatureToConfigMap[feature as Features];
    return config[configKey];
  }

  // Otherwise, treat it as a config key string
  return config[feature as keyof FeaturesConfig];
}

/**
 * Hook to get multiple feature flags as an object
 * Useful when you need several specific flags
 *
 * @param featureNames - Array of feature names to extract
 * @returns Object with only the requested features
 *
 * @example
 * ```tsx
 * function NavbarComponent() {
 *   const { enableGitHubLinks, enableNavBarLinks, enableThemeSwitcher } =
 *     useFeatureFlags(['enableGitHubLinks', 'enableNavBarLinks', 'enableThemeSwitcher']);
 *
 *   return (
 *     <nav>
 *       {enableNavBarLinks && <NavBarLinks />}
 *       {enableGitHubLinks && <GitHubLinks />}
 *       {enableThemeSwitcher && <ThemeSwitcher />}
 *     </nav>
 *   );
 * }
 * ```
 */
export function useFeatureFlags<T extends keyof FeaturesConfig>(
  featureNames: T[]
): Pick<FeaturesConfig, T> {
  const config = useFeaturesConfig();

  return useMemo(() => {
    const result = {} as Pick<FeaturesConfig, T>;

    featureNames.forEach((name) => {
      result[name] = config[name];
    });

    return result;
  }, [config, featureNames]);
}
