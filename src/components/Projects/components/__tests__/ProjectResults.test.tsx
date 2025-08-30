import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectResults from '../../components/ProjectResults';

const sampleCategories = [
  {
    category: 'Web',
    subCategories: [
      { name: 'React', projects: [{ title: 'A', summary: 'A' }] }
    ]
  }
];

describe('ProjectResults', () => {
  it('renders empty state when no categories', () => {
    render(
      <ProjectResults
        filteredCategories={[] as any}
        searchTerm={''}
        activeFilter={'all'}
        onFilterToggle={() => {}}
        onScrollToFilters={() => {}}
      />
    );
    expect(screen.getByText('No Projects Found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Filters/ })).toBeInTheDocument();
  });

  it('shows count with search term', () => {
    render(
      <ProjectResults
        filteredCategories={sampleCategories as any}
        searchTerm={'foo'}
        activeFilter={'all'}
        onFilterToggle={() => {}}
        onScrollToFilters={() => {}}
      />
    );
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toMatch(/"foo" Project/);
    expect(heading.textContent).toMatch(/: 1/);
  });
});

