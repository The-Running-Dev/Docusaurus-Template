import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('../../../../config', () => ({
  useFeaturesConfig: () => ({ projectsPage: true })
}));

vi.mock('../../../../hooks', () => ({
  useProjects: () => ({
    getProjectsByTag: (t: string) => (t === 'has' ? [{}] : []),
    getProjectsByCategory: (c: string) => (c === 'web' ? [{}] : [])
  })
}));

import { useProjectFiltering } from '../useProjectFiltering';

describe('useProjectFiltering', () => {
  it('shouldCreateLink respects features and data presence', () => {
    const { result } = renderHook(() => useProjectFiltering());
    const api = result.current;
    // configuredLink => always true
    expect(api.shouldCreateLink('/x', 'anything')).toBe(true);
    // tag
    expect(api.shouldCreateLink(undefined, 'tag-has')).toBe(true);
    expect(api.shouldCreateLink(undefined, 'tag-missing')).toBe(false);
    // category
    expect(api.shouldCreateLink(undefined, 'category-web')).toBe(true);
    expect(api.shouldCreateLink(undefined, 'category-mobile')).toBe(false);
  });

  it('getFilterLink builds encoded URL', () => {
    const { result } = renderHook(() => useProjectFiltering());
    expect(result.current.getFilterLink(undefined, 'tag-ui lib')).toBe(
      '/projects?filter=tag-ui%20lib'
    );
  });
});
