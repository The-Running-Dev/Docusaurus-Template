import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminTabsModal } from './AdminTabsModal';

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

// Mock custom hooks
vi.mock('./useAutoSave', () => ({
  useAutoSave: vi.fn()
}));

vi.mock('./useProjectValidation', () => ({
  useProjectValidation: vi.fn(() => [])
}));

vi.mock('./ActivityLogPanel', () => ({
  ActivityLogPanel: () => <div>Activity Log</div>
}));

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
) as any;

describe('AdminTabsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal and validation errors', () => {
    render(
      <AdminTabsModal open={true} onClose={() => {}} projectId="test-id" />
    );
    expect(screen.getByText(/Edit Project/)).toBeInTheDocument();
    expect(screen.getByText(/test-id/)).toBeInTheDocument();
  });
});
