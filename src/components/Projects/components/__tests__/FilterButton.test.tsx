import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterButton } from '../../components/FilterButton';

describe('FilterButton', () => {
  it('renders computed label with search results when searching', () => {
    render(
      <FilterButton
        option={{ key: 'web', label: 'Web (5)' }}
        isSelected={false}
        isDisabled={false}
        isLoading={false}
        hasSearchResults={true}
        searchResultCount={2}
        totalCount={5}
        onClick={() => {}}
        searchTerm={'react'}
      />
    );
    expect(screen.getByRole('button', { name: /Web \(2 of 5\)/i })).toBeInTheDocument();
  });

  it('applies active class when selected without search', () => {
    const { container } = render(
      <FilterButton
        option={{ key: 'web', label: 'Web (5)' }}
        isSelected={true}
        isDisabled={false}
        onClick={() => {}}
      />
    );

    const btn = container.querySelector('button');
    expect(btn?.className).toMatch(/filterButton/);
    expect(btn?.className).toMatch(/active/);
  });

  it('disables and shows disabled class when searching without results', () => {
    const { container } = render(
      <FilterButton
        option={{ key: 'web', label: 'Web (5)' }}
        isSelected={false}
        isDisabled={true}
        hasSearchResults={false}
        onClick={() => {}}
        searchTerm={'x'}
      />
    );

    const btn = container.querySelector('button')!;
    expect(btn.className).toMatch(/disabled/);
    expect(btn.disabled).toBe(true);
  });
});
