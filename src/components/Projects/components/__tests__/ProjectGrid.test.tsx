import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectGrid from '../../components/ProjectGrid';

describe('ProjectGrid', () => {
  const categories = [
    {
      category: 'Web',
      subCategories: [
        {
          name: 'React',
          projects: [
            {
              title: 'Old Project',
              summary: 'Older',
              lastModified: '2023-01-01',
              tags: ['UI']
            },
            {
              title: 'New Project',
              summary: 'Newer',
              lastModified: '2024-11-20',
              tags: ['UI', 'React']
            }
          ]
        }
      ]
    }
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sorts projects by lastModified descending', () => {
    render(
      <ProjectGrid
        categories={categories as any}
        searchTerm={''}
        activeFilter={'all'}
        onFilterToggle={() => {}}
        onScrollToFilters={() => {}}
      />
    );
    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titles[0]).toBe('New Project');
    expect(titles[1]).toBe('Old Project');
  });

  it('shows Recent badge for projects within 6 months', () => {
    render(
      <ProjectGrid
        categories={categories as any}
        searchTerm={''}
        activeFilter={'all'}
        onFilterToggle={() => {}}
        onScrollToFilters={() => {}}
      />
    );
    expect(screen.getByText('Recent')).toBeInTheDocument();
  });

  it('disables tag filter buttons while searching', () => {
    render(
      <ProjectGrid
        categories={categories as any}
        searchTerm={'react'}
        activeFilter={'all'}
        onFilterToggle={() => {}}
        onScrollToFilters={() => {}}
      />
    );
    const btns = screen.getAllByRole('button', { name: 'Filter by UI' }) as HTMLButtonElement[];
    expect(btns.length).toBeGreaterThan(0);
    for (const btn of btns) {
      expect(btn.disabled).toBe(true);
      expect(btn.className).toMatch(/disabled/);
    }
  });
});
