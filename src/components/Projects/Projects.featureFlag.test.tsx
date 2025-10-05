import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Feature disabled
vi.mock('../../config', () => ({
  useFeaturesConfig: () => ({ projectsPage: false })
}));

// Safe defaults for hooks to avoid crashes
vi.mock('../../hooks/useProjects', () => ({
  useProjects: () => ({ data: null, loading: false, error: null })
}));

// Mock AuthProvider hook
vi.mock('../Auth/AuthProvider', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isInitializing: false,
    login: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    error: null
  })
}));

import Projects from './Projects';

describe('Projects feature flag', () => {
  it('renders nothing when projectsPage disabled', () => {
    const { container } = render(<Projects />);
    expect(container.firstChild).toBeNull();
  });
});
