import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BulkActionsToolbar } from './BulkActionsToolbar';

describe('BulkActionsToolbar', () => {
  it('renders bulk action buttons for admin', () => {
    render(<BulkActionsToolbar selected={['1', '2']} onAction={() => {}} isAdmin={true} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Move Category')).toBeInTheDocument();
    expect(screen.getByText('Change Tags')).toBeInTheDocument();
  });
});
