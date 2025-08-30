import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock useProcessor to return controlled processedData regardless of input
vi.mock('../useProcessor', () => ({
  useProcessor: () => ({
    processedData: {
      categories: [
        {
          category: 'Web',
          subCategories: [
            {
              name: 'React',
              projects: [
                { title: 'A', summary: 'S', tags: ['UI', 'React'], lastModified: '2024-01-01' },
                { title: 'B', summary: 'S', tags: ['UI'] }
              ]
            }
          ]
        },
        {
          category: 'Backend',
          subCategories: [
            { name: 'Node', projects: [{ title: 'C', summary: 'S', tags: ['API'] }] }
          ]
        }
      ],
      stats: { totalProjects: 3, recentProjects: 1, totalTechnologies: 2, averageAge: '1y' },
      categoryText: 'Web & Backend',
      technologyOptions: [],
      categoryOptions: [],
      dateOptions: [],
      tagOptions: [],
      tagTiers: { popular: [], common: [], rare: [], allTagsOption: { key: 'all-tags', label: 'All (3)', category: 'tag', count: 3 } }
    },
    loading: false,
    error: null
  })
}));

import { useProjects } from '../useProjects';

describe('useProjects (Projects/hooks)', () => {
  it('builds queries for tags, technologies, and categories', () => {
    const { result } = renderHook(() => useProjects());
    const api = result.current;
    expect(api.getAllTags().sort()).toEqual(['api', 'react', 'ui']);
    expect(api.getAllTechnologies().sort()).toEqual(['node', 'react']);
    expect(api.getAllCategories().sort()).toEqual(['backend', 'web']);

    expect(api.hasProjectsWithTag('UI')).toBe(true);
    expect(api.getProjectsByTag('React').length).toBe(1);
    expect(api.hasProjectsWithTechnology('Node')).toBe(true);
    expect(api.hasProjectsWithCategory('web')).toBe(true);
  });
});

