import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

const sampleData = [
  {
    category: 'Web',
    subCategories: [
      {
        name: 'React',
        projects: [
          { title: 'A', summary: 'S', tags: ['UI', 'React'], lastModified: '2025-01-01' },
          { title: 'B', summary: 'S', tags: ['UI'], lastModified: '2024-09-15' }
        ]
      }
    ]
  },
  {
    category: 'Backend',
    subCategories: [
      { name: 'Node', projects: [{ title: 'C', summary: 'S', tags: ['API'], lastModified: '2023-01-01' }] }
    ]
  }
] as any;

describe('hooks/useProjects (root)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-02-01'));
  });

  it('provides tag/category helpers and recent projects window', async () => {
    // Mock store to provide projects data
    await vi.doMock('../../store/dataStore', () => ({
      useDataStore: () => ({
        getData: (key: string) => (key === 'projects' ? sampleData : null),
        isLoading: () => false,
        getError: () => null,
        getMetadata: () => ({ source: 'static' })
      })
    }));

    const { useProjects } = await import('../useProjects');
    const { result } = renderHook(() => useProjects());
    const api = result.current;

    // Tag/category queries
    expect(api.getProjectsByTag('React').length).toBeGreaterThan(0);
    expect(api.getProjectsByCategory('Web').map((p) => p.title).sort()).toEqual(['A', 'B']);
    expect(api.getAvailableCategories().sort()).toEqual(['Backend', 'Web']);

    // Recent projects (default 6 months back from 2025-02-01)
    const recent = api.getRecentProjects();
    const titles = recent.map((p) => p.title);
    expect(titles).toContain('A'); // 2025-01-01
    expect(titles).toContain('B'); // within 6 months window from 2025-02-01

    // Stats derived
    const stats = api.getProjectStats();
    expect(stats.totalProjects).toBe(3);
    expect(typeof stats.recentProjects).toBe('number');
    expect(stats.totalTechnologies).toBeGreaterThan(0);
    expect(['days', 'months', 'years', 'N/A'].some((u) => String(stats.averageAge).includes(u))).toBe(true);
  });

  it('returns safe defaults when no data', async () => {
    await vi.doMock('../../store/dataStore', () => ({
      useDataStore: () => ({
        getData: () => null,
        isLoading: () => false,
        getError: () => null,
        getMetadata: () => undefined
      })
    }));

    const { useProjects } = await import('../useProjects');
    const { result } = renderHook(() => useProjects());
    const stats = result.current.getProjectStats();
    expect(stats).toEqual({ totalProjects: 0, recentProjects: 0, totalTechnologies: 0, averageAge: 'N/A' });
  });
});


