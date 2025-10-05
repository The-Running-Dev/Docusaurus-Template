import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock useAuth hook for admin tests
vi.mock('../Auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: vi.fn(() => ({
    user: { roles: ['admin'] },
    isAuthenticated: true,
    isInitializing: false,
    login: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    error: null
  }))
}));

// Mock feature flags to enable Projects page
vi.mock('../../config', () => ({
  useFeaturesConfig: () => ({
    giscusComments: false,
    gitHubLinks: false,
    navBarLinks: false,
    themeSwitcher: false,
    textSizeSwitcher: false,
    readerMode: false,
    versionDisplay: false,
    cvPage: false,
    portfolioPage: false,
    projectsPage: true,
    portfolioPageAsIndex: false,
    dataCaching: false
  })
}));

// Mock store-backed projects hook to control data/loading/error
vi.mock('../../hooks/useProjects', async () => {
  return {
    useProjects: () => ({
      data: mockData,
      loading: mockLoading,
      error: mockError,
      metadata: undefined
    })
  } as any;
});

// Force URL filter to allow all results by default in tests
vi.mock('./hooks', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useUrlFilter: () => ({
      selectedFilter: 'all',
      setSelectedFilter: () => {},
      isLoading: false,
      error: null
    })
  };
});

// Import after mocks
import Projects from './Projects';

let mockLoading: boolean = false;
let mockError: Error | null = null;
let mockData: any[] | null = null;

describe('Projects (integration)', () => {
  it('shows loading state', () => {
    mockLoading = true;
    mockError = null;
    mockData = null;
    render(<Projects />);
    expect(screen.getByText(/Loading Projects/)).toBeInTheDocument();
    mockLoading = false;
  });

  it('shows error state', () => {
    mockLoading = false;
    mockError = new Error('fail');
    mockData = null;
    render(<Projects />);
    expect(screen.getByText(/Data Loading Error/)).toBeInTheDocument();
    expect(screen.getByText(/fail/)).toBeInTheDocument();
    mockError = null;
  });

  it('shows empty state when no data', () => {
    mockLoading = false;
    mockError = null;
    mockData = [];
    render(<Projects />);
    expect(screen.getByText(/No Projects Found/)).toBeInTheDocument();
  });

  it('renders header, stats and results with data', () => {
    mockLoading = false;
    mockError = null;
    mockData = [
      {
        category: 'Web',
        subCategories: [
          {
            name: 'React',
            projects: [
              {
                title: 'Proj',
                summary: 'S',
                lastModified: new Date().toISOString(),
                tags: ['React']
              }
            ]
          }
        ]
      }
    ];
    render(<Projects />);
    // Header and one stat label should appear
    expect(
      screen.getByRole('heading', { level: 1, name: /Projects/ })
    ).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/Total|Recent|Technolog/);
    // Project card title should render from results
    expect(screen.getByText('Proj')).toBeInTheDocument();
  });
});
