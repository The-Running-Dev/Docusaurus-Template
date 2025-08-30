import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Tooltip from '../Tooltip';

describe('Tooltip', () => {
  it('renders only children when no items', () => {
    render(
      <Tooltip title="T" items={[]}>
        <span>child</span>
      </Tooltip>
    );
    expect(screen.getByText('child')).toBeInTheDocument();
    expect(document.querySelector('.tooltip')).toBeNull();
  });

  it('shows tooltip with tags and computes default position', () => {
    render(
      <Tooltip title="Title" items={["A", "B"]}>
        <button>Hover me</button>
      </Tooltip>
    );
    const wrapper = screen.getByText('Hover me').parentElement!;
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    const tooltip = document.querySelector('.tooltip') as HTMLElement;
    expect(tooltip.className).toMatch(/tooltip--(bottom|top|left|right)/);
  });
});
