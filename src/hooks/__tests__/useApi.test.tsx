import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApi } from '../useApi';

describe('useApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('does not fetch without endpoint', () => {
    const { result } = renderHook(() => useApi({ endpoint: '' }));
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetches data successfully', async () => {
    const payload = { ok: true };
    // @ts-ignore
    global.fetch = vi.fn(async () => ({ ok: true, json: async () => payload }));

    const { result } = renderHook(() => useApi({ endpoint: '/api/test' }));
    // Allow promises to flush
    await act(async () => {});
    expect(result.current.data).toEqual(payload);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('retries on failure and surfaces error after max attempts', async () => {
    vi.useFakeTimers();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // First two attempts fail, then still fail
    // @ts-ignore
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: 'err', json: async () => ({}) })
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: 'err', json: async () => ({}) })
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: 'err', json: async () => ({}) });

    const { result } = renderHook(() =>
      useApi({ endpoint: '/api/fail', retryAttempts: 2, retryDelay: 50 })
    );

    // initial attempt and then one retry
    await act(async () => {
      vi.advanceTimersByTime(0);
    });
    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.loading).toBe(false);
    warnSpy.mockRestore();
    errSpy.mockRestore();
    vi.useRealTimers();
  });
});
