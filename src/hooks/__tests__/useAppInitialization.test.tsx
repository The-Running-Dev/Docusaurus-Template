import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

describe('useAppInitialization', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('loads only enabled features', async () => {
    // Partially mock to keep enums/mapping while overriding hook
    vi.doMock('../../config/FeaturesConfig', async () => {
      const actual = await vi.importActual<any>('../../config/FeaturesConfig');
      return {
        ...actual,
        useFeaturesConfig: vi.fn(() => ({
          // Only Portfolio enabled
          portfolioPage: true,
          projectsPage: false
        }))
      };
    });

    // Spy on DataLoader.loadMultipleData
    const mod = await import('../../services/dataLoader');
    const spy = vi.spyOn(mod.DataLoader.prototype, 'loadMultipleData').mockResolvedValue();

    const { useAppInitialization } = await import('../useAppInitialization');
    renderHook(() => useAppInitialization());

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    }, { timeout: 1000 });

    // Should only be called once (or verify the latest call has correct data)
    const lastCallIndex = spy.mock.calls.length - 1;
    const arg = spy.mock.calls[lastCallIndex][0] as Array<{ key: string }>;
    const keys = arg.map((a) => a.key).sort();
    expect(keys).toEqual(['portfolio']);
  });

  it('loads both when both features enabled', async () => {
    vi.doMock('../../config/FeaturesConfig', async () => {
      const actual = await vi.importActual<any>('../../config/FeaturesConfig');
      return {
        ...actual,
        useFeaturesConfig: vi.fn(() => ({ portfolioPage: true, projectsPage: true }))
      };
    });

    const mod = await import('../../services/dataLoader');
    const spy = vi.spyOn(mod.DataLoader.prototype, 'loadMultipleData').mockResolvedValue();

    const { useAppInitialization } = await import('../useAppInitialization');
    renderHook(() => useAppInitialization());

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    }, { timeout: 1000 });

    const lastCallIndex = spy.mock.calls.length - 1;
    const arg = spy.mock.calls[lastCallIndex][0] as Array<{ key: string }>;
    const keys = arg.map((a) => a.key).sort();
    expect(keys).toEqual(['portfolio', 'projects']);
  });
});


