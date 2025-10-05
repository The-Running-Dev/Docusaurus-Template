import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdminOverlay } from './AdminOverlay';

// Mock useAuth hook
vi.mock('../Auth/AuthProvider', () => ({
  useAuth: vi.fn()
}));

import { useAuth } from '../Auth/AuthProvider';
const mockUseAuth = vi.mocked(useAuth);

describe('AdminOverlay', () => {
  it('renders children for admin user', () => {
    mockUseAuth.mockReturnValue({
      user: { roles: ['admin'] },
      isAuthenticated: true,
      isInitializing: false,
      login: vi.fn(),
      logout: vi.fn(),
      refresh: vi.fn(),
      error: null
    });

    render(
      <AdminOverlay>
        <div>Admin Content</div>
      </AdminOverlay>
    );
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('does not render for non-admin user', () => {
    mockUseAuth.mockReturnValue({
      user: { roles: ['user'] },
      isAuthenticated: true,
      isInitializing: false,
      login: vi.fn(),
      logout: vi.fn(),
      refresh: vi.fn(),
      error: null
    });

    render(
      <AdminOverlay>
        <div>Admin Content</div>
      </AdminOverlay>
    );
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
