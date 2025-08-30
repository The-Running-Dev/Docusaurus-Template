import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import CardGrid from '../CardGrid';

describe('CardGrid', () => {
  it('renders children with default class', () => {
    const { container } = render(
      <CardGrid>
        <div>child</div>
      </CardGrid>
    );
    expect(container.querySelector('.projectGrid')).toBeTruthy();
  });

  it('applies custom class', () => {
    const { container } = render(
      <CardGrid className="x">
        <div />
      </CardGrid>
    );
    expect(container.querySelector('.x')).toBeTruthy();
  });
});

