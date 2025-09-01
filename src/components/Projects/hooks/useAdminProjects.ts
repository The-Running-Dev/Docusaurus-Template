import { useCallback, useEffect, useState } from 'react';
import { type ProjectTarget, type SaveProjectInput } from '../models';

const defaultApiBase = (() => {
  if (typeof window !== 'undefined' && (window as any).DOCS_API_BASE) {
    return (window as any).DOCS_API_BASE as string;
  }
  if (typeof process !== 'undefined' && (process as any).env && (process as any).env.DOCS_API_BASE) {
    return (process as any).env.DOCS_API_BASE as string;
  }
  return 'http://localhost:4000/api';
})();

export interface UseAdminProjectsOptions {
  apiBase?: string;
  token?: string;
}

export function useAdminProjects(options: UseAdminProjectsOptions = {}) {
  const [apiBase, setApiBase] = useState<string>(options.apiBase || defaultApiBase);
  const [token, setTokenState] = useState<string>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('adminToken') || options.token || '' : options.token || ''
  );

  // Synchronous persistence wrapper to avoid test flakiness and keep UI responsive
  const setToken = useCallback((value: string) => {
    setTokenState(value);
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('adminToken', value || ''); } catch { /* ignore */ void 0; }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('adminToken', token || ''); } catch { /* ignore */ void 0; }
    }
  }, [token]);

  const putProject = useCallback(async (input: SaveProjectInput, overrideToken?: string) => {
    const t = overrideToken || token || (typeof window !== 'undefined' ? localStorage.getItem('adminToken') || '' : '');
    const url = `${apiBase}/v1/projects/${encodeURIComponent(input.category)}/${encodeURIComponent(input.subCategory)}/${encodeURIComponent(input.slug)}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': t },
      body: JSON.stringify(input.project)
    });
    if (!res.ok) {
      let message = `${res.status} ${res.statusText}`;
      try { const err = await res.json(); if (err?.error) message = err.error; } catch { /* ignore */ void 0; }
      throw new Error(message);
    }
  }, [apiBase, token]);

  const bulkDelete = useCallback(async (targets: ProjectTarget[], overrideToken?: string) => {
    const t = overrideToken || token || (typeof window !== 'undefined' ? localStorage.getItem('adminToken') || '' : '');
    for (const target of targets) {
      const url = `${apiBase}/v1/projects/${encodeURIComponent(target.category)}/${encodeURIComponent(target.subCategory)}/${encodeURIComponent(target.slug)}`;
      const res = await fetch(url, { method: 'DELETE', headers: { 'x-admin-token': t } });
      if (!res.ok) throw new Error(`Failed to delete ${target.slug}`);
    }
  }, [apiBase, token]);

  const refresh = useCallback(async () => {
    // Optionally ping to warm cache or trigger rebuild; no-op here.
  }, []);

  return {
    apiBase,
    setApiBase,
    token,
    setToken,
    putProject,
    bulkDelete,
    refresh
  } as const;
}

export default useAdminProjects;
