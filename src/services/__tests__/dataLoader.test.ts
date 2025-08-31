import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Features } from '../../config/FeaturesConfig/models';

type MockState = {
  data: Record<string, any>;
  loading: Record<string, boolean>;
  errors: Record<string, Error | null>;
  metadata: Record<string, any>;
  setData: (key: string, data: any, meta?: any) => void;
  setLoading: (key: string, v: boolean) => void;
  setError: (key: string, e: Error | null) => void;
  getData: (key: string) => any;
  getError: (key: string) => Error | null;
  isLoading: (key: string) => boolean;
  getMetadata: (key: string) => any;
};

function createMockState(): MockState {
  const state: MockState = {
    data: {},
    loading: {},
    errors: {},
    metadata: {},
    setData(key, data, meta = {}) {
      this.data[key] = data;
      this.errors[key] = null;
      this.metadata[key] = {
        timestamp: Date.now(),
        source: meta.source || 'unknown',
        size: data ? JSON.stringify(data).length : 0,
        ...meta
      };
    },
    setLoading(key, v) { this.loading[key] = v; },
    setError(key, e) { this.errors[key] = e; },
    getData(key) { return this.data[key]; },
    getError(key) { return this.errors[key] || null; },
    isLoading(key) { return this.loading[key] || false; },
    getMetadata(key) { return this.metadata[key]; }
  };
  return state;
}

describe('services/DataLoader', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('loads default data when no feature specified', async () => {
    vi.resetModules();
    const storeState = createMockState();
    await vi.doMock('../../store/dataStore', () => ({ useDataStore: { getState: () => storeState } }));
    const { DataLoader } = await import('../dataLoader');
    const loader = new DataLoader();
    await loader.loadData('k1', undefined, { v: 1 });
    expect(storeState.getData('k1')).toEqual({ v: 1 });
    expect(storeState.getError('k1')).toBeNull();
    expect(storeState.getMetadata('k1')?.source).toBe('static');
  });

  it('loads http data when feature has http source', async () => {
    vi.resetModules();
    const feature = Features.ProjectsPage;
    // @ts-ignore
    global.fetch = vi.fn(async () => ({ ok: true, status: 200, statusText: 'OK', json: async () => ({ hello: 'world' }) }));

    const storeState = createMockState();
    await vi.doMock('../../store/dataStore', () => ({ useDataStore: { getState: () => storeState } }));
    const { DataLoader } = await import('../dataLoader');
    vi.spyOn(DataLoader.prototype as any, 'getDataConfig').mockReturnValue({ source: 'https://api.example.com/data', provider: 'http' });
    const loader = new DataLoader();
    await loader.loadData('k2', feature, { fallback: true });
    expect(storeState.getData('k2')).toEqual({ hello: 'world' });
    expect(storeState.getMetadata('k2')?.source).toBe('https://api.example.com/data');
    expect(storeState.getError('k2')).toBeNull();
  });

  it('uses default data for json provider (non-http source)', async () => {
    vi.resetModules();
    const feature = Features.PortfolioPage;
    const storeState = createMockState();
    await vi.doMock('../../store/dataStore', () => ({ useDataStore: { getState: () => storeState } }));
    const { DataLoader } = await import('../dataLoader');
    vi.spyOn(DataLoader.prototype as any, 'getDataConfig').mockReturnValue({ source: '/local/config.json', provider: 'json' });
    const loader = new DataLoader();
    const fallback = { local: true };
    await loader.loadData('k3', feature, fallback);
    expect(storeState.getData('k3')).toEqual(fallback);
    expect(storeState.getMetadata('k3')?.source).toBe('/local/config.json');
  });

  it('sets error when http fetch fails', async () => {
    vi.resetModules();
    const feature = Features.GitHubLinks;
    // @ts-ignore
    global.fetch = vi.fn(async () => ({ ok: false, status: 500, statusText: 'ERR', json: async () => ({}) }));

    const storeState = createMockState();
    await vi.doMock('../../store/dataStore', () => ({ useDataStore: { getState: () => storeState } }));
    const { DataLoader } = await import('../dataLoader');
    vi.spyOn(DataLoader.prototype as any, 'getDataConfig').mockReturnValue({ source: 'https://api.example.com/bad', provider: 'http' });
    const loader = new DataLoader();
    await loader.loadData('k4', feature, { ignored: true });
    expect(storeState.getError('k4')).toBeInstanceOf(Error);
    expect(storeState.getData('k4')).toBeUndefined();
  });

  it('loads multiple data sources in parallel', async () => {
    vi.resetModules();
    const feature = Features.ProjectsPage;
    // @ts-ignore
    global.fetch = vi.fn(async () => ({ ok: true, status: 200, statusText: 'OK', json: async () => ([1,2,3]) }));

    const storeState = createMockState();
    await vi.doMock('../../store/dataStore', () => ({ useDataStore: { getState: () => storeState } }));
    const { DataLoader } = await import('../dataLoader');
    vi.spyOn(DataLoader.prototype as any, 'getDataConfig').mockImplementation((feat?: any) => {
      if (!feat) return null;
      return { source: 'https://api.example.com/data', provider: 'http' };
    });
    const loader = new DataLoader();
    await loader.loadMultipleData([
      { key: 'a', feature, defaultData: [] },
      { key: 'b', defaultData: { z: 1 } }
    ]);
    expect(storeState.getData('a')).toEqual([1,2,3]);
    expect(storeState.getData('b')).toEqual({ z: 1 });
  });
});
