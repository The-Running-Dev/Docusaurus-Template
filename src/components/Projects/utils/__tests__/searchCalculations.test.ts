import { describe, it, expect } from 'vitest';
import { calculateCategoryResults, calculateTechnologyResults } from '../../utils/searchCalculations';

const processedData = {
  categories: [
    {
      category: 'web',
      subCategories: [
        { name: 'React', projects: [{}, {}] },
        { name: 'Vue', projects: [{}] }
      ]
    }
  ]
} as any;

describe('searchCalculations', () => {
  it('calculateCategoryResults computes counts', () => {
    const all = calculateCategoryResults(processedData, { key: 'all', label: 'All (3)' }, 3);
    expect(all.searchResultCount).toBe(3);

    const web = calculateCategoryResults(processedData, { key: 'web', label: 'Web (3)' }, 3);
    expect(web.searchResultCount).toBe(3);
  });

  it('calculateTechnologyResults computes counts', () => {
    const all = calculateTechnologyResults(processedData, { key: 'all', label: 'All (3)' }, 3);
    expect(all.searchResultCount).toBe(3);

    const react = calculateTechnologyResults(processedData, { key: 'web-React', label: 'React (2)', category: 'web' }, 3);
    expect(react.searchResultCount).toBe(2);
  });
});

