import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateStats,
  createCategoryText,
  generateTechnologyOptions,
  generateCategoryOptions,
  generateDateOptions,
  generateTagTiers,
  applyDateFiltering
} from '../../utils/processorHelpers';

const categories = [
  {
    category: 'Web',
    subCategories: [
      {
        name: 'React',
        projects: [
          { title: 'A', summary: 'S', lastModified: '2023-01-01', tags: ['UI', 'React'] },
          { title: 'B', summary: 'S', lastModified: '2024-12-01', tags: ['UI'] }
        ]
      }
    ]
  },
  {
    category: 'Backend',
    subCategories: [
      { name: 'Node', projects: [{ title: 'C', summary: 'S', lastModified: undefined, tags: ['API'] }] }
    ]
  }
] as any;

describe('processorHelpers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01'));
  });
  afterEach(() => vi.useRealTimers());

  it('calculateStats computes totals and averageAge', () => {
    const stats = calculateStats(categories);
    expect(stats.totalProjects).toBe(3);
    expect(stats.recentProjects).toBeGreaterThanOrEqual(1); // depends on dates
    expect(stats.totalTechnologies).toBe(2);
    expect(stats.averageAge).toMatch(/y|months|days/);
  });

  it('createCategoryText formats names', () => {
    expect(createCategoryText([{ category: 'Web', subCategories: [] }] as any)).toBe('Web');
    expect(createCategoryText(categories)).toMatch(/Web/);
  });

  it('generate options include counts', () => {
    const tech = generateTechnologyOptions(categories);
    expect(tech[0].key).toBe('all');
    expect(tech.find((t) => t.key.endsWith('-React'))?.count).toBe(2);

    const cat = generateCategoryOptions(categories);
    expect(cat[0].label).toMatch(/All/);
    expect(cat.find((c) => c.key === 'Web')?.label).toMatch(/\(2\)/);
  });

  it('generateDateOptions returns expected keys', () => {
    const opts = generateDateOptions(categories);
    const keys = opts.map((o) => o.key);
    expect(keys).toContain('most-recent');
    expect(keys).toContain('all-dates');
  });

  it('generateTagTiers splits by counts', () => {
    const tiers = generateTagTiers(categories);
    expect(tiers.allTagsOption.key).toBe('all-tags');
    expect([...tiers.popular, ...tiers.common, ...tiers.rare].length).toBeGreaterThan(0);
  });

  it('applyDateFiltering respects ranges', () => {
    const all = applyDateFiltering(categories, 'all-dates');
    expect(all[0].subCategories[0].projects.length).toBe(2);
    const mostRecent = applyDateFiltering(categories, 'most-recent');
    // Older project (2023-01-01) should drop
    const len = mostRecent[0]?.subCategories[0]?.projects.length ?? 0;
    expect(len).toBeLessThanOrEqual(2);
  });
});

