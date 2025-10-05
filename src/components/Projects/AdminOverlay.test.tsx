import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AdminOverlay } from './AdminOverlay';

describe('AdminOverlay', () => {
  it('renders children for admin user', () => {
    render(
      <AdminOverlay isAdmin={true}>
        <div>Admin Content</div>
      </AdminOverlay>
    );
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('does not render for non-admin user', () => {
    render(
      <AdminOverlay isAdmin={false}>
        <div>Admin Content</div>
      </AdminOverlay>
    );
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
