import React, { useEffect } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { useAdminProjects } from '../useAdminProjects';

function getFetchMock() {
  return global.fetch as unknown as ReturnType<typeof vi.fn>;
}

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
  onReady: (api: ReturnType<typeof useAdminProjects>) => void;
}) {
  const api = useAdminProjects();
  useEffect(() => {
    onReady(api);
  }, [api, onReady]);
  return null;
}

describe('useAdminProjects', () => {
  beforeEach(() => {
    cleanup();
    const ls = createLocalStorageMock();
    vi.stubGlobal('localStorage', ls as any);
    Object.defineProperty(window, 'localStorage', {
      value: ls,
      configurable: true
    });
    // @ts-ignore
    global.fetch = vi.fn();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('PUT saves project with correct headers and body', async () => {
    getFetchMock().mockResolvedValue({ ok: true });

    const ready = new Promise<ReturnType<typeof useAdminProjects>>(
      (resolve) => {
        render(<HookHarness onReady={resolve} />);
      }
    );
    const api = await ready;
    await api.putProject(
      {
        category: 'Web',
        subCategory: 'React',
        slug: 'proj',
        project: { title: 'Proj', summary: 'S', tags: [] }
      },
      'OVERRIDE'
    );

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/projects/Web/React/proj'),
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          Authorization: 'Bearer OVERRIDE',
          'Content-Type': 'application/json'
        })
      })
    );
  });

  it('PUT error parses JSON error message', async () => {
    const json = vi.fn().mockResolvedValue({ error: 'bad' });
    getFetchMock().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad',
      json
    });

    const ready = new Promise<ReturnType<typeof useAdminProjects>>(
      (resolve) => {
        render(<HookHarness onReady={resolve} />);
      }
    );
    const api = await ready;
    await expect(
      api.putProject({
        category: 'Web',
        subCategory: 'React',
        slug: 'p',
        project: { title: 't', summary: 's', tags: [] }
      })
    ).rejects.toThrow('bad');
  });

  it('DELETE bulk deletes all targets with token header', async () => {
    getFetchMock().mockResolvedValue({ ok: true });

    const ready = new Promise<ReturnType<typeof useAdminProjects>>(
      (resolve) => {
        render(<HookHarness onReady={resolve} />);
      }
    );
    const api = await ready;
    localStorage.setItem('accessToken', 'TKN');
    await api.bulkDelete([
      { category: 'Web', subCategory: 'React', slug: 'a' },
      { category: 'Web', subCategory: 'React', slug: 'b' }
    ]);

    expect((fetch as any).mock.calls.length).toBe(2);
    expect((fetch as any).mock.calls[0][1].headers.Authorization).toBe(
      'Bearer TKN'
    );
    expect((fetch as any).mock.calls[1][1].headers.Authorization).toBe(
      'Bearer TKN'
    );
  });

  it('DELETE reports all failed slugs in one error', async () => {
    getFetchMock()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true })
      .mockRejectedValueOnce(new Error('network'));

    const ready = new Promise<ReturnType<typeof useAdminProjects>>(
      (resolve) => {
        render(<HookHarness onReady={resolve} />);
      }
    );
    const api = await ready;
    localStorage.setItem('accessToken', 'TKN');

    await expect(
      api.bulkDelete([
        { category: 'Web', subCategory: 'React', slug: 'a' },
        { category: 'Web', subCategory: 'React', slug: 'b' },
        { category: 'Web', subCategory: 'React', slug: 'c' }
      ])
    ).rejects.toThrow('Failed to delete 2 project(s): a, c');
  });

  it('persists token to localStorage when changed', async () => {
    const ready = new Promise<ReturnType<typeof useAdminProjects>>(
      (resolve) => {
        render(<HookHarness onReady={resolve} />);
      }
    );
    const api = await ready;
    await act(async () => {
      api.setToken('ABC');
      // flush effects
      await Promise.resolve();
    });
    expect(localStorage.getItem('adminToken')).toBe('ABC');
  });
});
