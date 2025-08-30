import { describe, it, expect, beforeEach } from 'vitest';
import { DataCacheConfig, getData } from '../../data/dataLoader';

describe('dataLoader caching', () => {
  beforeEach(() => {
    // ensure cache starts disabled
    DataCacheConfig.setFromFeatures(false);
    // Clear any previous cache contents
    DataCacheConfig.clear();
  });

  it('getData returns frozen cached reference when cache enabled', () => {
    const obj = { a: 1 };
    const r1 = getData(obj, { cache: false });
    const r2 = getData(obj, { cache: false });
    // Without cache, it returns the raw object reference
    expect(r1).toBe(obj);
    expect(r2).toBe(obj);
    const c1 = getData(obj, { cache: true });
    const c2 = getData(obj, { cache: true });
    expect(c1).toBe(c2);
    expect(Object.isFrozen(c1)).toBe(true);
  });

  it('processor applies transformation and can be cached', () => {
    const obj = { a: 1 };
    const p = (d: any) => ({ b: d.a + 1 });
    const r = getData(obj, { processor: p, cache: true });
    expect((r as any).b).toBe(2);
    const r2 = getData(obj, { processor: p, cache: true });
    expect(r2).toBe(r);
  });

  it('global isEnabled enables caching in production when setFromFeatures(true)', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    DataCacheConfig.setFromFeatures(true);
    const obj = { k: 'v' };
    const a = getData(obj); // should cache
    const b = getData(obj); // should be same frozen reference
    expect(a).toBe(b);
    expect(Object.isFrozen(a)).toBe(true);
    // reset
    DataCacheConfig.setFromFeatures(false);
    process.env.NODE_ENV = prev;
  });
});
