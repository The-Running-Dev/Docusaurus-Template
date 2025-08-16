/**
 * Cache Manager
 *
 * Provides utilities for managing data cache configuration
 * and integrating with the features configuration system.
 */

import type { FeaturesConfig } from '../config/FeaturesConfig/models';
import { DataCacheConfig } from './dataLoader';

/**
 * Initialize cache configuration from features config
 * This should be called during app initialization to sync cache settings
 *
 * @param featuresConfig - The loaded features configuration
 */
export function initializeCacheFromFeatures(
  featuresConfig: FeaturesConfig
): void {
  DataCacheConfig.setFromFeatures(featuresConfig.dataCaching);
}

/**
 * Utility function to manually control cache state
 * Useful for testing, debugging, or runtime cache control
 *
 * @param enabled - Whether to enable caching
 */
export function setCacheEnabled(enabled: boolean): void {
  (DataCacheConfig as any).enabled = enabled;
}

/**
 * Get current cache statistics
 * Useful for debugging and monitoring
 */
export function getCacheStats() {
  return {
    enabled: DataCacheConfig.isEnabled(),
    size: DataCacheConfig.size(),
    environment: process.env.NODE_ENV || 'development'
  };
}

/**
 * Clear all cached data and optionally disable caching
 *
 * @param disable - Whether to also disable caching after clearing
 */
export function clearCache(disable = false): void {
  DataCacheConfig.clear();
  if (disable) {
    setCacheEnabled(false);
  }
}

/**
 * Development helper to log cache state
 * Only logs in development environment
 */
export function logCacheState(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('Data Cache State:', getCacheStats());
  }
}
