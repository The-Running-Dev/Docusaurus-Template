import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initializeCacheFromFeatures, setCacheEnabled, getCacheStats, clearCache, logCacheState } from '../cacheManager';
import { DataCacheConfig, getData } from '../dataLoader';

describe('cacheManager', () => {
  beforeEach(() => {
    // Reset cache state
    (DataCacheConfig as any).enabled = false;
    DataCacheConfig.clear();
  });

  it('initializes from features config', () => {
    initializeCacheFromFeatures({ dataCaching: true } as any);
    expect(DataCacheConfig.isEnabled()).toBe(true);

    initializeCacheFromFeatures({ dataCaching: false } as any);
    expect(DataCacheConfig.isEnabled()).toBe(false);
  });

  it('toggles cache enabled state', () => {
    setCacheEnabled(true);
    expect(DataCacheConfig.isEnabled()).toBe(true);
    setCacheEnabled(false);
    expect(DataCacheConfig.isEnabled()).toBe(false);
  });

  it('clears cache entries and can disable cache', () => {
    // Seed cache by forcing caching on
    getData({ foo: 'bar' }, { cache: true });
    expect(DataCacheConfig.size()).toBeGreaterThan(0);
    clearCache();
    expect(DataCacheConfig.size()).toBe(0);

    setCacheEnabled(true);
    expect(DataCacheConfig.isEnabled()).toBe(true);
    clearCache(true);
    expect(DataCacheConfig.isEnabled()).toBe(false);
  });

  it('returns cache stats and logs only in development', () => {
    const origEnv = process.env.NODE_ENV;
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    process.env.NODE_ENV = 'test';
    logCacheState();
    expect(spy).not.toHaveBeenCalled();

    process.env.NODE_ENV = 'development';
    logCacheState();
    expect(spy).toHaveBeenCalledWith('Data Cache State:', expect.objectContaining({ enabled: expect.any(Boolean), size: expect.any(Number), environment: 'development' }));

    process.env.NODE_ENV = origEnv;
    spy.mockRestore();
  });

  it('getCacheStats reflects DataCacheConfig state', () => {
    setCacheEnabled(true);
    getData({ a: 1 }, { cache: true });
    const stats = getCacheStats();
    expect(stats.enabled).toBe(true);
    expect(typeof stats.size).toBe('number');
    expect(stats.environment).toBe(process.env.NODE_ENV || 'development');
  });
});

