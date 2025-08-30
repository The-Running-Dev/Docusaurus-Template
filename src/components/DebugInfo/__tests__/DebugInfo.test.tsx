import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DebugInfo from '../DebugInfo';

describe('DebugInfo', () => {
  const originalEnv = process.env.NODE_ENV;
  it('renders only in development', () => {
    process.env.NODE_ENV = 'development';
    render(
      <DebugInfo
        loading={false}
        error={null}
        meta={{ provider: 'TEST', cached: true }}
        metrics={[{ label: 'Foo', value: 1 }]}
      />
    );
    expect(screen.getByText(/Data: LOADED | TEST \(CACHED\)/)).toBeInTheDocument();
    expect(screen.getByText(/Foo: 1/)).toBeInTheDocument();

    process.env.NODE_ENV = 'test';
    // Re-render should show nothing
    const { container } = render(<DebugInfo />);
    expect(container.firstChild).toBeNull();
    process.env.NODE_ENV = originalEnv;
  });
});

