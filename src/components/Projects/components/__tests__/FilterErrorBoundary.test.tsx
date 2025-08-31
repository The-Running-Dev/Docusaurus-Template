import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterErrorBoundary } from '../../components/FilterErrorBoundary';

function Boom() {
  throw new Error('boom');
}

describe('FilterErrorBoundary', () => {
  it('renders fallback when child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <FilterErrorBoundary>
        {/* @ts-expect-error testing error path */}
        <Boom />
      </FilterErrorBoundary>
    );
    expect(screen.getByText(/Filter Error/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh Page/ })).toBeInTheDocument();
    spy.mockRestore();
  });
});
