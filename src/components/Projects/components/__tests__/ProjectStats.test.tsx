import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectStats from '../../components/ProjectStats';

describe('ProjectStats', () => {
  it('renders stats with correct singular/plural labels', () => {
    render(
      <ProjectStats
        stats={{ totalProjects: 2, recentProjects: 1, totalTechnologies: 1, averageAge: '1y' }}
      />
    );
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Recent')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Average Age')).toBeInTheDocument();
  });
});

