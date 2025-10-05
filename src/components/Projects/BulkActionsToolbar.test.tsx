import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BulkActionsToolbar } from './BulkActionsToolbar';

// Mock useAuth hook
vi.mock('../Auth/AuthProvider', () => ({
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

describe('BulkActionsToolbar', () => {
  it('renders bulk action buttons for admin', () => {
    render(<BulkActionsToolbar selected={['1', '2']} onAction={() => {}} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Move Category')).toBeInTheDocument();
    expect(screen.getByText('Change Tags')).toBeInTheDocument();
  });
});
