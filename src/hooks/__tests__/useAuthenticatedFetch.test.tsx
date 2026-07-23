import React, { useEffect } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useAuthenticatedFetch } from '../useAuthenticatedFetch';

function getFetchMock() {
  return global.fetch as unknown as ReturnType<typeof vi.fn>;
}

const refreshMock = vi.fn();

vi.mock('../../components/Auth/AuthProvider', () => ({
  useAuth: () => ({
    refresh: refreshMock
  })
}));

function createLocalStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    }
  };
}

function HookHarness({
  onReady
}: {
  onReady: (api: ReturnType<typeof useAuthenticatedFetch>) => void;
}) {
  const api = useAuthenticatedFetch();
  useEffect(() => {
    onReady(api);
  }, [api, onReady]);
  return null;
}

describe('useAuthenticatedFetch', () => {
  beforeEach(() => {
    refreshMock.mockReset();
    const ls = createLocalStorageMock();
    vi.stubGlobal('localStorage', ls as any);
    Object.defineProperty(window, 'localStorage', {
      value: ls,
      configurable: true
    });
    // @ts-ignore
    global.fetch = vi.fn();
  });

  it('adds Authorization header and include credentials when token exists', async () => {
    localStorage.setItem('accessToken', 'tok1');
    getFetchMock().mockResolvedValue({ status: 200, ok: true });

    const ready = new Promise<ReturnType<typeof useAuthenticatedFetch>>(
      (resolve) => {
        render(<HookHarness onReady={resolve} />);
      }
    );
    const api = await ready;
    await api.authenticatedFetch('http://localhost/test', { method: 'GET' });

    expect(fetch).toHaveBeenCalledTimes(1);
    const requestOptions = (fetch as any).mock.calls[0][1];
    expect(requestOptions.method).toBe('GET');
    expect(requestOptions.credentials).toBe('include');
    expect(requestOptions.headers.get('Authorization')).toBe('Bearer tok1');
  });

  it('retries once after 401 when refresh succeeds', async () => {
    localStorage.setItem('accessToken', 'old');
    refreshMock.mockResolvedValue(true);
    getFetchMock()
      .mockResolvedValueOnce({ status: 401, ok: false })
      .mockResolvedValueOnce({ status: 200, ok: true });

    const ready = new Promise<ReturnType<typeof useAuthenticatedFetch>>(
      (resolve) => {
        render(<HookHarness onReady={resolve} />);
      }
    );
    const api = await ready;

    const promise = api.authenticatedFetch('http://localhost/retry', {
      method: 'POST'
    });
    localStorage.setItem('accessToken', 'new');
    await promise;

    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect((fetch as any).mock.calls[1][1].headers.get('Authorization')).toBe(
      'Bearer new'
    );
  });

  it('does not retry after 401 when refresh fails', async () => {
    localStorage.setItem('accessToken', 'old');
    refreshMock.mockResolvedValue(false);
    getFetchMock().mockResolvedValue({ status: 401, ok: false });

    const ready = new Promise<ReturnType<typeof useAuthenticatedFetch>>(
      (resolve) => {
        render(<HookHarness onReady={resolve} />);
      }
    );
    const api = await ready;
    await api.authenticatedFetch('http://localhost/retry-fail');

    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('preserves existing Headers instances when injecting Authorization', async () => {
    localStorage.setItem('accessToken', 'tok1');
    getFetchMock().mockResolvedValue({ status: 200, ok: true });

    const ready = new Promise<ReturnType<typeof useAuthenticatedFetch>>(
      (resolve) => {
        render(<HookHarness onReady={resolve} />);
      }
    );
    const api = await ready;

    const headers = new Headers({
      'X-Test': 'value'
    });

    await api.authenticatedFetch('http://localhost/headers', {
      method: 'GET',
      headers
    });

    const sentHeaders = (fetch as any).mock.calls[0][1].headers as Headers;
    expect(sentHeaders.get('X-Test')).toBe('value');
    expect(sentHeaders.get('Authorization')).toBe('Bearer tok1');
  });

  it('preserves tuple-array headers when retrying after refresh', async () => {
    localStorage.setItem('accessToken', 'old');
    refreshMock.mockResolvedValue(true);
    getFetchMock()
      .mockResolvedValueOnce({ status: 401, ok: false })
      .mockResolvedValueOnce({ status: 200, ok: true });

    const ready = new Promise<ReturnType<typeof useAuthenticatedFetch>>(
      (resolve) => {
        render(<HookHarness onReady={resolve} />);
      }
    );
    const api = await ready;

    const promise = api.authenticatedFetch('http://localhost/retry-headers', {
      headers: [['X-Test', 'value']]
    });
    localStorage.setItem('accessToken', 'new');
    await promise;

    const retryHeaders = (fetch as any).mock.calls[1][1].headers as Headers;
    expect(retryHeaders.get('X-Test')).toBe('value');
    expect(retryHeaders.get('Authorization')).toBe('Bearer new');
  });

  it('handles missing localStorage.getItem gracefully', async () => {
    // @ts-ignore
    vi.stubGlobal('localStorage', { setItem: vi.fn() });
    Object.defineProperty(window, 'localStorage', {
      // @ts-ignore
      value: { setItem: vi.fn() },
      configurable: true
    });
    getFetchMock().mockResolvedValue({ status: 200, ok: true });

    const ready = new Promise<ReturnType<typeof useAuthenticatedFetch>>(
      (resolve) => {
        render(<HookHarness onReady={resolve} />);
      }
    );
    const api = await ready;
    await expect(
      api.authenticatedFetch('http://localhost/no-storage')
    ).resolves.toEqual(expect.objectContaining({ ok: true }));

    expect(
      (fetch as any).mock.calls[0][1].headers.Authorization
    ).toBeUndefined();
  });
});
