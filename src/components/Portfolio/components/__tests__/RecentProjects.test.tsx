import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Stub ProjectsLink to a span so we can see tags
vi.mock('../ProjectsLink', () => ({
  __esModule: true,
  default: ({ children }: any) => <span className="PL">{children}</span>
}));

import RecentProjects from '../RecentProjects';

describe('RecentProjects', () => {
  it('returns null when no projects', () => {
    const { container } = render((<RecentProjects projects={[]} />) as any);
    expect(container.firstChild).toBeNull();
  });

  it('renders up to 3 projects with tags', () => {
    const projects = [
      { title: 'A', summary: 'S', tags: ['X', 'Y'] },
      { title: 'B', summary: 'S', tags: ['Z'] },
      { title: 'C', summary: 'S', tags: [] },
      { title: 'D', summary: 'S', tags: [] }
    ] as any;
    render(<RecentProjects projects={projects} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.queryByText('D')).toBeNull();
    // Tags rendered through stub
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('Y')).toBeInTheDocument();
    expect(screen.getByText('Z')).toBeInTheDocument();
  });
});
