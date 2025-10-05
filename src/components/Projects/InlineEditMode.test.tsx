import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InlineEditMode } from './InlineEditMode';

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

describe('InlineEditMode', () => {
  it('renders value and allows editing for admin', () => {
    render(<InlineEditMode value="Test Title" onSave={() => {}} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    fireEvent.doubleClick(screen.getByText('Test Title'));
    expect(screen.getByDisplayValue('Test Title')).toBeInTheDocument();
  });
});
