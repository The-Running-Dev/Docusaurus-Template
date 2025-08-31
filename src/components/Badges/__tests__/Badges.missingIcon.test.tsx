import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock FontAwesome to expose resolved icon name
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: (props: any) => (
    <span data-testid="fa" data-icon={String(props.icon?.iconName || 'unknown')} />
  )
}));

// Mock DataProvider to run processor
vi.mock('../../DataProvider/DataProvider', () => ({
  __esModule: true,
  default: ({ children, processor, defaultData }: any) =>
    children(processor(defaultData), false, null)
}));

// Provide data where categories use `icon` field (no `iconName`) like real JSON
vi.mock('../constants', () => ({
  DEFAULT_BADGES_DATA: {
    templateVariables: { user: 'u', repository: 'r' },
    badgeCategories: [
      { key: 'a', title: 'A', icon: 'faCogs', badges: [] },
      { key: 'b', title: 'B', icon: 'faShieldAlt', badges: [] }
    ]
  }
}));

import Badges from '../Badges';

describe('Badges icon fallback when iconName missing', () => {
  it('falls back to faCogs when iconName is undefined', () => {
    render(<Badges />);

    // Both categories should render, and both icons fall back to faCogs
    expect(screen.getByRole('heading', { name: /A/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /B/ })).toBeInTheDocument();

    const icons = screen.getAllByTestId('fa');
    const names = icons.map((n) => (n as HTMLElement).getAttribute('data-icon'));
    // faCogs iconName is 'gears' in FontAwesome v6
    expect(names).toEqual(['gears', 'gears']);
  });
});

