/**
 * Global Cache Configuration
 * Controls caching behavior across the entire data loading system
 */
interface IDataCacheConfig {
  enabled: boolean;
  clear(): void;
  size(): number;
  setFromFeatures(enableDataCaching: boolean): void;
  isEnabled(): boolean;
}

export const DataCacheConfig: IDataCacheConfig = {
  enabled: false,
  clear(): void {
    dataCache.clear();
  },
  size(): number {
    return dataCache.size;
  },
  setFromFeatures(enableDataCaching: boolean): void {
    this.enabled = enableDataCaching;
  },
  isEnabled(): boolean {
    const isDevelopment = process.env.NODE_ENV === 'development';

    return this.enabled && !isDevelopment;
  }
};

/**
 * Options for on-demand data loading
 */
interface GetDataOptions<T> {
  /** Enable/disable caching for this specific call (overrides global setting) */
  cache?: boolean;

  /** Optional processor function to transform the data */
  processor?: (data: any) => T;
}

/**
 * Cache for on-demand data loading (when caching is enabled)
 */
const dataCache = new Map<any, any>();

/**
 * Process raw data on-demand with optional caching and transformation
 *
 * @param rawData - Raw JSON data to process
 * @param options - Processing options (cache, processor)
 * @returns Typed and processed data
 *
 * @example
 * // Basic usage with imported data
 * const config = getData<VersionConfig>(versionConfigJson);
 *
 * // With custom processor
 * const processedData = getData(rawData, {
 *   processor: (data) => transformToSpecialFormat(data)
 * });
 *
 * // Force caching even when globally disabled
 * const cachedData = getData(rawData, { cache: true });
 *
 * // Force no caching even when globally enabled
 * const freshData = getData(rawData, { cache: false });
 */
export function getData<T = any>(
  rawData: any,
  options: GetDataOptions<T> = {}
): T {
  const shouldCache =
    options.cache !== undefined ? options.cache : DataCacheConfig.isEnabled();

  const { processor } = options;

  // Derive a stable cache key from content
  const cacheKey = shouldCache ? JSON.stringify(rawData) : undefined;

  if (shouldCache && cacheKey && dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey) as T;
  }

  let result: T = rawData as T;
  if (processor) {
    result = processor(rawData);
  }

  if (shouldCache && cacheKey) {
    // Freeze to avoid accidental external mutation of cached value
    const frozen =
      typeof result === 'object' && result !== null
        ? Object.freeze(result as object)
        : result;
    dataCache.set(cacheKey, frozen);
    return frozen as T;
  }

  return result;
}
