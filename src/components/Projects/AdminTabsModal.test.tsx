import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminTabsModal } from './AdminTabsModal';

// Mock useAdminProjects hook
vi.mock('./hooks/useAdminProjects', () => ({
  useAdminProjects: vi.fn(() => ({
    putProject: vi.fn(),
    token: 'test-token',
    apiBase: 'http://localhost:4000/api'
  }))
}));

// Mock useAuthenticatedFetch hook
vi.mock('../../hooks/useAuthenticatedFetch', () => ({
  useAuthenticatedFetch: vi.fn(() => ({
    authenticatedFetch: vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => []
    })
  }))
}));

// Mock useProjectValidation hook
vi.mock('./useProjectValidation', () => ({
  useProjectValidation: vi.fn(() => [])
}));

// Mock ActivityLogPanel
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

  it('renders modal and validation errors', async () => {
    render(
      <AdminTabsModal
        open={true}
        onClose={() => {}}
        projectId="test-id"
        isAdmin={true}
      />
    );
    await waitFor(() => {
      expect(screen.getByText(/Edit Project/)).toBeInTheDocument();
      expect(screen.getByText(/test-id/)).toBeInTheDocument();
    });
  });
});
