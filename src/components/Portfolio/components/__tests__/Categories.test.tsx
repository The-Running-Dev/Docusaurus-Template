import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../ProjectsLink', () => ({
  __esModule: true,
  default: ({ filter, children }: any) => (
    <a href={`/_mock?filter=${encodeURIComponent(filter)}`}>{children}</a>
  )
}));

import Categories from '../Categories';

describe('Categories', () => {
  it('renders ProjectsLink with category filter', () => {
    render(
      <Categories categories={[{ category: 'Web', description: 'd', icon: 'i', subCategories: [] } as any]} />
    );
    const link = screen.getByRole('link') as HTMLAnchorElement;
    expect(decodeURIComponent(link.getAttribute('href') || '')).toContain('/_mock?filter=category-web');
  });
});
