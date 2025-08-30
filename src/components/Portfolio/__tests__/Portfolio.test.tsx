import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock feature flags
vi.mock('../../config', () => ({
  useFeaturesConfig: () => ({ portfolioPage: true })
}));

// Mock Docusaurus context via local wrapper to avoid loading real package
vi.mock('../../../docusaurus/useDocusaurusContext', () => ({
  default: () => ({ siteConfig: { title: 'Site Title' } })
}));

// Stub child components to focus on top-level behavior
vi.mock('../components', () => ({
  Stats: ({ stats }: any) => <div data-testid="Stats">{stats?.length}</div>,
  Categories: ({ categories }: any) => <div data-testid="Categories">{categories?.length}</div>,
  RecentProjects: ({ projects }: any) => <div data-testid="Recent">{projects?.length}</div>,
  TechStack: ({ technologies }: any) => <div data-testid="Tech">{technologies?.length}</div>
}));

import { useDataStore } from '../../../store/dataStore';

import Portfolio from '../Portfolio';

describe('Portfolio', () => {
  beforeEach(() => {
    const store = useDataStore.getState();
    // Reset store state for portfolio key
    store.clearData('portfolio');
    store.setLoading('portfolio', false);
    store.setError('portfolio', null);
  });

  it('shows loading', () => {
    const store = useDataStore.getState();
    store.setLoading('portfolio', true);
    render(<Portfolio />);
    expect(screen.getByText(/Loading Portfolio/)).toBeInTheDocument();
  });

  it('shows error', () => {
    const store = useDataStore.getState();
    store.setError('portfolio', new Error('boom'));
    render(<Portfolio />);
    expect(screen.getByText(/Error Loading Portfolio: boom/)).toBeInTheDocument();
  });

  it('shows empty when no header', () => {
    const store = useDataStore.getState();
    store.setData('portfolio', {});
    render(<Portfolio />);
    expect(screen.getByText(/No Portfolio Data Found/)).toBeInTheDocument();
  });

  it('renders header and sections with data', () => {
    const store = useDataStore.getState();
    store.setData('portfolio', {
      header: { title: 'My Portfolio', subtitle: 'Sub' },
      stats: [{}, {}],
      projects: [{ category: 'Web', subCategories: [] }],
      technologies: [{ name: 'React', category: 'Web' }]
    });
    render(<Portfolio />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My Portfolio');
    expect(screen.getByText('Sub')).toBeInTheDocument();
    expect(screen.getByTestId('Stats').textContent).toBe('2');
    expect(screen.getByTestId('Categories').textContent).toBe('1');
    // Recent stub receives projects from useProjects; without wiring, it will be 0; we assert presence only
    expect(screen.getByTestId('Recent')).toBeInTheDocument();
    expect(screen.getByTestId('Tech').textContent).toBe('1');
  });
});
