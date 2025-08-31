import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock useTechnologyMapping to control filter
vi.mock('../../hooks/useTechnologyMapping', () => ({
  useTechnologyMapping: () => ({
    getFilterKey: (name: string, cat: string) => `${cat}-${name}`
  })
}));

vi.mock('../ProjectsLink', () => ({
  __esModule: true,
  default: ({ filter, children }: any) => (
    <a href={`/_mock?filter=${encodeURIComponent(filter)}`}>{children}</a>
  )
}));

import TechStack from '../TechStack';

describe('TechStack', () => {
  it('wraps items with Tooltip when subCategories exist and links to projects filter', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <TechStack
        technologies={[
          { name: 'React', category: 'Web', subCategories: ['Hooks', 'SSR'] },
          { name: 'Node', category: 'Backend' }
        ] as any}
      />
    );

    // Tooltip title visible after mouse enter
    const techItem = document.querySelector('.techItem')!;
    fireEvent.mouseEnter(techItem.parentElement!.parentElement!);
    const titleEl = document.querySelector('.tooltip__title') as HTMLElement;
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent).toBe('React');
    expect(screen.getByText('Hooks')).toBeInTheDocument();
    expect(screen.getByText('SSR')).toBeInTheDocument();

    // Link resolved using getFilterKey
    const links = document.querySelectorAll('a[href*="/_mock?filter="]');
    const hrefs = Array.from(links).map((a) => (a as HTMLAnchorElement).href);
    expect(hrefs.some((h) => decodeURIComponent(h).includes('Web-React'))).toBe(true);
    expect(hrefs.some((h) => decodeURIComponent(h).includes('Backend-Node'))).toBe(true);
    spy.mockRestore();
  });
});
