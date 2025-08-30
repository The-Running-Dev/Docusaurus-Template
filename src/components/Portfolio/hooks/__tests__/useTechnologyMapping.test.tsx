import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock useProjects to deliver projects data for mapping
vi.mock('../../../../hooks/useProjects', () => ({
  useProjects: () => ({
    data: [
      { category: 'Web', subCategories: [{ name: 'React', projects: [{}] }] },
      { category: 'Backend', subCategories: [{ name: 'Node.js', projects: [{}] }] }
    ]
  })
}));

import { useTechnologyMapping } from '../useTechnologyMapping';

describe('useTechnologyMapping', () => {
  it('maps to subcategory key when exact or normalized matches', () => {
    const { result } = renderHook(() => useTechnologyMapping());
    expect(result.current.getTechnologyFilterKey('React', 'Web')).toBe('Web-React');
    // Node.js variations
    expect(result.current.getTechnologyFilterKey('NodeJS', 'Backend')).toBe('Backend-Node.js');
    // Fallback to tag key when not found
    expect(result.current.getFilterKey('Redis', 'Backend')).toBe('tag-redis');
  });
});
