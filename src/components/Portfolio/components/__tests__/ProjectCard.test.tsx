import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectCard from '../ProjectCard';

describe('ProjectCard', () => {
  const project = { title: 'T', summary: 'S', link: 'https://example.com', tags: ['A', 'B'] } as any;

  it('renders title, summary, link and tags via renderTags', () => {
    render(
      <ProjectCard
        project={project}
        renderTags={(tags) => (
          <>
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </>
        )}
      />
    );
    expect(screen.getByRole('heading', { level: 4, name: 'T' })).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'View Project' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});

