import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mocks for hooks used by TechTags
const mockFiltering = { shouldCreateLink: vi.fn(), getFilterLink: vi.fn() };
vi.mock('../../Portfolio/hooks/useProjectFiltering', () => ({
  useProjectFiltering: () => mockFiltering
}));

const mockMapping = { getFilterKey: vi.fn() };
vi.mock('../../Portfolio/hooks/useTechnologyMapping', () => ({
  useTechnologyMapping: () => mockMapping
}));

import TechTags from '../TechTags';

describe('TechTags', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders links for technologies with matching projects and spans for others', () => {
    // Map technologies to filter keys
    mockMapping.getFilterKey.mockImplementation((tech: string) => {
      const map: Record<string, string> = {
        'React': 'tag-react',
        'Node.js': 'tag-node-js',
        'Rust': 'tag-rust'
      };
      return map[tech] || `tag-${tech.toLowerCase()}`;
    });

    // Allow links for react/node, not for rust
    mockFiltering.shouldCreateLink.mockImplementation((_cfg: string | undefined, filter: string) => !/rust/i.test(filter));
    mockFiltering.getFilterLink.mockImplementation((cfg: string | undefined, f: string) => cfg || `/projects?filter=${encodeURIComponent(f)}`);

    render(<TechTags techString="React, Node.js, Rust" />);

    // React link
    const react = screen.getByRole('link', { name: 'React' }) as HTMLAnchorElement;
    expect(react).toHaveAttribute('href', '/projects?filter=tag-react');
    expect(react).toHaveClass('cv-tech-tag');
    expect(react).toHaveAttribute('title', 'View projects using React');

    // Node.js link (encoded key returned from mapping)
    const node = screen.getByRole('link', { name: 'Node.js' }) as HTMLAnchorElement;
    expect(node.getAttribute('href')).toBe('/projects?filter=tag-node-js');

    // Rust should render as inactive span
    const rust = screen.getByText('Rust');
    expect(rust.tagName.toLowerCase()).toBe('span');
    expect(rust).toHaveClass('cv-tech-tag');
    expect(rust).toHaveClass('cv-tech-tag-inactive');
  });

  it('trims and skips empty items from the list', () => {
    mockMapping.getFilterKey.mockImplementation((tech: string) => `tag-${tech.toLowerCase().replace(/\s+/g, '-')}`);
    mockFiltering.shouldCreateLink.mockReturnValue(false);

    const { container } = render(<TechTags techString={"  React  , ,  Node.js ,   ,"} />);

    // Should render exactly two tags
    const tags = container.querySelectorAll('.cv-tech-tag');
    expect(tags.length).toBe(2);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('encodes filter keys in link href', () => {
    mockMapping.getFilterKey.mockImplementation((tech: string) => {
      if (tech === 'UI Framework') return 'tag-ui framework';
      return `tag-${tech.toLowerCase()}`;
    });
    mockFiltering.shouldCreateLink.mockReturnValue(true);
    mockFiltering.getFilterLink.mockImplementation((_cfg: string | undefined, f: string) => `/projects?filter=${encodeURIComponent(f)}`);

    render(<TechTags techString="UI Framework" />);

    const link = screen.getByRole('link', { name: 'UI Framework' }) as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/projects?filter=tag-ui%20framework');
  });

  it('applies the provided container className and defaults when omitted', () => {
    mockMapping.getFilterKey.mockImplementation((tech: string) => `tag-${tech.toLowerCase()}`);
    mockFiltering.shouldCreateLink.mockReturnValue(false);

    // Default className
    const { container: c1, unmount } = render(<TechTags techString="React" />);
    expect(c1.querySelector('div.cv-tech-tags')).toBeTruthy();
    unmount();

    // Custom className
    const { container: c2 } = render(<TechTags techString="React" className="custom-tags" />);
    expect(c2.querySelector('div.custom-tags')).toBeTruthy();
  });
});

