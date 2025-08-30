import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TechCard from '../TechCard';

describe('TechCard', () => {
  it('renders name, category, and indicator when subcategories exist', () => {
    render(<TechCard tech={{ name: 'React', category: 'Web', subCategories: ['Hooks'] } as any} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Web')).toBeInTheDocument();
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <TechCard tech={{ name: 'React', category: 'Web' } as any}>
        <div>Child</div>
      </TechCard>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});

