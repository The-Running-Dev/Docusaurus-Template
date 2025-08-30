import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategoryCard from '../CategoryCard';

describe('CategoryCard', () => {
  it('renders category title and description', () => {
    render(
      <CategoryCard category={{ category: 'Web', description: 'Desc', icon: 'I', subCategories: [] } as any}>
        <span>extra</span>
      </CategoryCard>
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Web' })).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
    expect(screen.getByText('extra')).toBeInTheDocument();
  });
});

