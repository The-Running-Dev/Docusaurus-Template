import React, { useEffect } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { useAdminProjects } from '../useAdminProjects';

function HookHarness({ onReady }: { onReady: (api: ReturnType<typeof useAdminProjects>) => void }) {
  const api = useAdminProjects();
  useEffect(() => { onReady(api); }, [api, onReady]);
  return null;
}

describe('useAdminProjects', () => {
  beforeEach(() => {
    cleanup();
    // @ts-ignore
    global.fetch = vi.fn();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('PUT saves project with correct headers and body', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: true });

    const ready = new Promise<ReturnType<typeof useAdminProjects>>((resolve) => {
      render(<HookHarness onReady={resolve} />);
    });
    const api = await ready;
    await api.putProject({
      category: 'Web',
      subCategory: 'React',
      slug: 'proj',
      project: { title: 'Proj', summary: 'S', tags: [] }
    }, 'OVERRIDE');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/projects/Web/React/proj'),
      expect.objectContaining({ 
        method: 'PUT', 
        headers: expect.objectContaining({ 
          'Authorization': 'Bearer OVERRIDE', 
          'Content-Type': 'application/json' 
        }) 
      })
    );
  });

  it('PUT error parses JSON error message', async () => {
    const json = vi.fn().mockResolvedValue({ error: 'bad' });
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: false, status: 400, statusText: 'Bad', json });

    const ready = new Promise<ReturnType<typeof useAdminProjects>>((resolve) => {
      render(<HookHarness onReady={resolve} />);
    });
    const api = await ready;
    await expect(api.putProject({ category: 'Web', subCategory: 'React', slug: 'p', project: { title: 't', summary: 's', tags: [] } })).rejects.toThrow('bad');
  });

  it('DELETE bulk deletes all targets with token header', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

    const ready = new Promise<ReturnType<typeof useAdminProjects>>((resolve) => {
      render(<HookHarness onReady={resolve} />);
    });
    const api = await ready;
    localStorage.setItem('accessToken', 'TKN');
    await api.bulkDelete([
      { category: 'Web', subCategory: 'React', slug: 'a' },
      { category: 'Web', subCategory: 'React', slug: 'b' }
    ]);

    expect((fetch as any).mock.calls.length).toBe(2);
    expect((fetch as any).mock.calls[0][1].headers['Authorization']).toBe('Bearer TKN');
    expect((fetch as any).mock.calls[1][1].headers['Authorization']).toBe('Bearer TKN');
  });

  it('persists token to localStorage when changed', async () => {
    const ready = new Promise<ReturnType<typeof useAdminProjects>>((resolve) => {
      render(<HookHarness onReady={resolve} />);
    });
    const api = await ready;
    await act(async () => {
      api.setToken('ABC');
      // flush effects
      await Promise.resolve();
    });
    expect(localStorage.getItem('adminToken')).toBe('ABC');
  });
});
