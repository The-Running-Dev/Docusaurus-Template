import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Section from '../Section';

describe('Section', () => {
  it('renders title at requested level and children', () => {
    render(
      <Section title="My Title" titleLevel="h3" className="outer">
        <div>Child</div>
      </Section>
    );
    expect(screen.getByRole('heading', { level: 3, name: 'My Title' })).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});

