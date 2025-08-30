import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock useProjectFiltering with controllable behavior
const mockApi = { shouldCreateLink: vi.fn(), getFilterLink: vi.fn() };
vi.mock('../../hooks/useProjectFiltering', () => ({
  useProjectFiltering: () => mockApi
}));

import ProjectsLink from '../ProjectsLink';

describe('ProjectsLink', () => {
  it('renders a div when shouldCreateLink returns false', () => {
    mockApi.shouldCreateLink.mockReturnValue(false);
    const { container } = render(
      <ProjectsLink filter="category-web" className="c">
        <span>child</span>
      </ProjectsLink>
    );
    const div = container.querySelector('div.c');
    expect(div).toBeTruthy();
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('renders anchor to configured link when allowed', () => {
    mockApi.shouldCreateLink.mockReturnValue(true);
    mockApi.getFilterLink.mockImplementation((cfg: string, f: string) => cfg || `/projects?filter=${encodeURIComponent(f)}`);
    render(
      <ProjectsLink configuredLink="/docs" filter="category-web" className="c">
        <span>child</span>
      </ProjectsLink>
    );
    const a = screen.getByRole('link');
    expect(a).toHaveAttribute('href', '/docs');
  });

  it('renders anchor to filter link when no configured link', () => {
    mockApi.shouldCreateLink.mockReturnValue(true);
    mockApi.getFilterLink.mockImplementation((cfg: string, f: string) => cfg || `/projects?filter=${encodeURIComponent(f)}`);
    render(
      <ProjectsLink filter="tag-ui framework" className="c">
        child
      </ProjectsLink>
    );
    const a = screen.getByRole('link') as HTMLAnchorElement;
    expect(decodeURIComponent(a.getAttribute('href') || '')).toContain('/projects?filter=tag-ui framework');
  });
});

