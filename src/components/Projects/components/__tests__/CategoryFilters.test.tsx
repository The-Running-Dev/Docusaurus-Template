import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategoryFilters from '../../components/CategoryFilters';

describe('CategoryFilters', () => {
  const categoryOptions = [
    { key: 'all', label: 'All (2)' },
    { key: 'web', label: 'Web (1)' },
    { key: 'mobile', label: 'Mobile (1)' }
  ];

  const processedData = {
    categories: [
      { category: 'web', subCategories: [{ name: 'React', projects: [{}] }] },
      { category: 'mobile', subCategories: [] }
    ]
  } as any;

  it('marks matching option as selected and respects category- prefix', () => {
    render(
      <CategoryFilters
        categoryOptions={categoryOptions}
        activeFilter={'category-web'}
        onFilterChange={() => {}}
      />
    );
    const web = screen.getByRole('button', { name: /Web/ });
    expect(web.className).toMatch(/active/);
  });

  it('disables options without search results when searching', () => {
    render(
      <CategoryFilters
        categoryOptions={categoryOptions}
        activeFilter={'all'}
        onFilterChange={() => {}}
        searchTerm={'react'}
        processedData={processedData}
      />
    );
    const webBtn = screen.getByRole('button', { name: /Web/ }) as HTMLButtonElement;
    const mobileBtn = screen.getByRole('button', { name: /Mobile/ }) as HTMLButtonElement;
    expect(webBtn.textContent).toMatch(/\(1 of 1\)/);
    expect(mobileBtn.disabled).toBe(true);
  });
});
