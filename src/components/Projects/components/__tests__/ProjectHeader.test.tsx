import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectHeader } from '../../components/ProjectHeader';

describe('ProjectHeader', () => {
  it('renders heading and lowers category text in subtitle', () => {
    render(<ProjectHeader categoryText={'Web'} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByText(/web development/i)).toBeInTheDocument();
  });
});

