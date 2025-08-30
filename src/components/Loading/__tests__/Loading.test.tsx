import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading', () => {
  it('renders message and secondary message', () => {
    render(<Loading message="Primary" secondaryMessage="Secondary" useWrap />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    const container = screen.getByText('Primary').closest('div')!;
    expect(container.className).toMatch(/loading-wrap/);
  });

  it('uses default container when useWrap is false', () => {
    render(<Loading message="Only" />);
    const container = screen.getByText('Only').closest('div')!;
    expect(container.className).toMatch(/loading-container/);
  });
});

