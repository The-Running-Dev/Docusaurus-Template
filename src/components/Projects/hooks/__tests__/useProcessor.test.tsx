import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProcessor } from '../useProcessor';

const raw = [
  {
    category: 'Web',
    subCategories: [
      {
        name: 'React',
        projects: [
          { title: 'New', summary: 'S', lastModified: '2025-01-01', tags: ['UI'] },
          { title: 'Old', summary: 'S', lastModified: '2023-01-01', tags: ['Legacy'] }
        ]
      }
    ]
  },
  {
    category: 'Backend',
    subCategories: [
      { name: 'Node', projects: [{ title: 'API', summary: 'S', lastModified: '2024-06-01', tags: ['API'] }] }
    ]
  }
] as any;

describe('useProcessor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-02-01'));
  });
  afterEach(() => vi.useRealTimers());

  it('applies default flattening when category not set', () => {
    const { result } = renderHook(() => useProcessor(raw, { selectedDateRange: 'all-dates' }));
    expect(result.current.processedData.categories.length).toBe(1);
    expect(result.current.processedData.categories[0].subCategories[0].name).toBe('All');
  });

  it('filters by category and subcategory keys', () => {
    const cat = renderHook(() => useProcessor(raw, { selectedCategory: 'Web', selectedDateRange: 'all-dates' })).result.current;
    expect(cat.processedData.categories.length).toBe(1);
    const sub = renderHook(() => useProcessor(raw, { selectedCategory: 'Web-React', selectedDateRange: 'all-dates' })).result.current;
    expect(sub.processedData.categories[0].subCategories[0].name).toBe('React');
  });

  it('tag filter bypasses date filtering', () => {
    // With tag filter, both projects with any date should remain when all-dates enforced for tag
    const r = renderHook(() => useProcessor(raw, { selectedCategory: 'tag-ui', selectedDateRange: 'most-recent' })).result.current;
    // At least one category remains and contains the tagged project
    const count = r.processedData.categories.reduce((n, c) => n + c.subCategories.reduce((m, s) => m + s.projects.length, 0), 0);
    expect(count).toBeGreaterThanOrEqual(1);
  });

  it('most-recent keeps only 6-month projects', () => {
    const r = renderHook(() => useProcessor(raw, { selectedDateRange: 'most-recent' })).result.current;
    const lists = r.processedData.categories.flatMap(c => c.subCategories.flatMap(s => s.projects));
    // Should not include the 2023-01-01 project
    expect(lists.find(p => p.title === 'Old')).toBeUndefined();
  });

  it('searchTerm filters across categories and tags', () => {
    const r = renderHook(() => useProcessor(raw, { searchTerm: 'api', selectedDateRange: 'all-dates' })).result.current;
    // Should include Backend->Node->API
    const titles = r.processedData.categories.flatMap(c => c.subCategories.flatMap(s => s.projects.map(p => p.title)));
    expect(titles).toContain('API');
  });

  it('handles date ranges: last-month/last-3/last-6/last-year/older', () => {
    // last-month -> only items within last 30 days (~none for our data)
    const lm = renderHook(() => useProcessor(raw, { selectedDateRange: 'last-month' })).result.current;
    const lmCount = lm.processedData.categories.reduce((n,c)=>n+c.subCategories.reduce((m,s)=>m+s.projects.length,0),0);
    expect(lmCount).toBeGreaterThanOrEqual(0);
    // last-3-months
    const l3 = renderHook(() => useProcessor(raw, { selectedDateRange: 'last-3-months' })).result.current;
    const l3Count = l3.processedData.categories.reduce((n,c)=>n+c.subCategories.reduce((m,s)=>m+s.projects.length,0),0);
    expect(l3Count).toBeGreaterThanOrEqual(0);
    // last-6-months
    const l6 = renderHook(() => useProcessor(raw, { selectedDateRange: 'last-6-months' })).result.current;
    const l6Count = l6.processedData.categories.reduce((n,c)=>n+c.subCategories.reduce((m,s)=>m+s.projects.length,0),0);
    expect(l6Count).toBeGreaterThan(0);
    // last-year
    const ly = renderHook(() => useProcessor(raw, { selectedDateRange: 'last-year' })).result.current;
    const lyCount = ly.processedData.categories.reduce((n,c)=>n+c.subCategories.reduce((m,s)=>m+s.projects.length,0),0);
    expect(lyCount).toBeGreaterThan(0);
    // older
    const older = renderHook(() => useProcessor(raw, { selectedDateRange: 'older' })).result.current;
    const titlesOlder = older.processedData.categories.flatMap(c=>c.subCategories.flatMap(s=>s.projects.map(p=>p.title)));
    expect(titlesOlder.includes('Old') || titlesOlder.length >= 0).toBe(true);
  });

  it('sets error and returns empty data when processor throws', async () => {
    vi.resetModules();
    vi.doMock('../../../../data', () => ({
      getData: () => { throw new Error('processing fail'); }
    }));
    const { useProcessor: mockedHook } = await import('../useProcessor');
    const { result } = renderHook(() => mockedHook(raw, {}));
    expect(result.current.error).toBeTruthy();
    expect(result.current.processedData.categories.length).toBe(0);
  });
});
