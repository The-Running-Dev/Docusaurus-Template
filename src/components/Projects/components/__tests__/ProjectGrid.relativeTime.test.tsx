import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectGrid from '../../components/ProjectGrid';

describe('ProjectGrid relative time', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01'));
  });
  afterEach(() => vi.useRealTimers());

  function gridWith(date: string | undefined) {
    const categories = [
      { category: 'Web', subCategories: [{ name: 'React', projects: [{ title: 'P', summary: 'S', lastModified: date }] }] }
    ] as any;
    render(<ProjectGrid categories={categories} searchTerm={''} activeFilter={'all'} onFilterToggle={() => {}} onScrollToFilters={() => {}} />);
  }

  it('shows Today for same-day', () => {
    gridWith('2025-01-01');
    expect(screen.getByText('Today')).toBeInTheDocument();
  });
  it('shows 1 day ago', () => {
    gridWith('2024-12-31');
    expect(screen.getByText('1 day ago')).toBeInTheDocument();
  });
  it('shows weeks and months and years', () => {
    gridWith('2024-12-20');
    expect(screen.getByText(/weeks ago|1 week ago/)).toBeInTheDocument();
    // re-render with months
    gridWith('2024-10-01');
    expect(screen.getByText(/months ago|1 month ago/)).toBeInTheDocument();
    // years
    gridWith('2020-01-01');
    expect(screen.getByText(/years ago|1 year ago/)).toBeInTheDocument();
  });
});

