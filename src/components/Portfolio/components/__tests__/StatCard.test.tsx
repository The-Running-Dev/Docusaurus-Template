import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

describe('StatCard', () => {
  it('renders number and label', () => {
    render(<StatCard stat={{ number: 5, label: 'Items' } as any} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Items')).toBeInTheDocument();
  });
});

