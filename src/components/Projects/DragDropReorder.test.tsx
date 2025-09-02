import React from 'react';
import { render, screen } from '@testing-library/react';
import { DragDropReorder } from './DragDropReorder';

describe('DragDropReorder', () => {
  it('renders project cards for drag & drop', () => {
    const projects = [
      { id: '1', title: 'Project 1' },
      { id: '2', title: 'Project 2' }
    ];
    render(<DragDropReorder projects={projects} onReorder={() => {}} />);
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
  });
});
