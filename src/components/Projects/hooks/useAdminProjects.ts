import { useCallback, useEffect, useState } from 'react';
import {
  type ProjectTarget,
  type SaveProjectInput
} from '../../../../shared/types/project-types';

const defaultApiBase = (() => {
  if (typeof window !== 'undefined' && (window as any).DOCS_API_BASE) {
    return (window as any).DOCS_API_BASE as string;
  }
  if (
    typeof process !== 'undefined' &&
    (process as any).env &&
    (process as any).env.DOCS_API_BASE
  ) {
    return (process as any).env.DOCS_API_BASE as string;
  }
  return 'http://localhost:4000/api';
})();

export interface UseAdminProjectsOptions {
  apiBase?: string;
  token?: string;
}

function safeGetStorageItem(key: string): string | null {
  try {
    if (typeof window === 'undefined') return null;
    const storage = (globalThis as any).localStorage;
    if (!storage || typeof storage.getItem !== 'function') return null;
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorageItem(key: string, value: string): void {
  try {
    if (typeof window === 'undefined') return;
    const storage = (globalThis as any).localStorage;
    if (!storage || typeof storage.setItem !== 'function') return;
    storage.setItem(key, value);
  } catch {
    /* ignore */ void 0;
  }
}

export function useAdminProjects(options: UseAdminProjectsOptions = {}) {
  const [apiBase, setApiBase] = useState<string>(
    options.apiBase || defaultApiBase
  );
  const [token, setTokenState] = useState<string>(
    () => safeGetStorageItem('adminToken') || options.token || ''
  );

  // Synchronous persistence wrapper to avoid test flakiness and keep UI responsive
  const setToken = useCallback((value: string) => {
    setTokenState(value);
    safeSetStorageItem('adminToken', value || '');
  }, []);

  useEffect(() => {
    safeSetStorageItem('adminToken', token || '');
  }, [token]);

  const putProject = useCallback(
    async (input: SaveProjectInput, overrideToken?: string) => {
      // Get JWT token from localStorage (set by AuthProvider)
      const jwtToken = safeGetStorageItem('accessToken');
      const t = overrideToken || jwtToken || '';

      const url = `${apiBase}/v1/projects/${encodeURIComponent(input.category)}/${encodeURIComponent(input.subCategory)}/${encodeURIComponent(input.slug)}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${t}`
        },
        body: JSON.stringify(input.project)
      });
      if (!res.ok) {
        let message = `${res.status} ${res.statusText}`;
        try {
          const err = await res.json();
          if (err?.error) message = err.error;
        } catch {
          /* ignore */ void 0;
        }
        throw new Error(message);
      }
    },
    [apiBase]
  );

  const bulkDelete = useCallback(
    async (targets: ProjectTarget[], overrideToken?: string) => {
      // Get JWT token from localStorage (set by AuthProvider)
      const jwtToken = safeGetStorageItem('accessToken');
      const t = overrideToken || jwtToken || '';

      const deletePromises = targets.map((target) => {
        const url = `${apiBase}/v1/projects/${encodeURIComponent(target.category)}/${encodeURIComponent(target.subCategory)}/${encodeURIComponent(target.slug)}`;
        return fetch(url, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${t}`
          }
        }).then((res) => ({ target, res }));
      });

      const results = await Promise.allSettled(deletePromises);
      const failedDeletes = results
        .map((result, index) => {
          if (result.status === 'rejected') {
            return { target: targets[index], error: result.reason };
          }
          if (result.status === 'fulfilled' && !result.value.res.ok) {
            return { target: result.value.target, error: 'HTTP error' };
          }
          return null;
        })
        .filter((item) => item !== null);

      if (failedDeletes.length > 0) {
        const failedSlugs = failedDeletes.map((f) => f?.target.slug).join(', ');
        throw new Error(
          `Failed to delete ${failedDeletes.length} project(s): ${failedSlugs}`
        );
      }
    },
    [apiBase]
  );

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
