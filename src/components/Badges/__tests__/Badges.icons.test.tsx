import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock FontAwesome to expose iconName
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: (props: any) => (
    <span data-testid="fa" data-icon={String(props.icon?.iconName || 'unknown')} />
  )
}));

// Use a controllable DataProvider that applies the Badges.processor
vi.mock('../../DataProvider/DataProvider', () => ({
  __esModule: true,
  default: ({ children, processor, defaultData }: any) => children(processor(defaultData), false, null)
}));

vi.mock('../constants', () => ({
  DEFAULT_BADGES_DATA: {
    templateVariables: { user: 'u', repository: 'r' },
    badgeCategories: [
      { key: 'stats', title: 'Stats', iconName: 'faChartLine', badges: [] },
      { key: 'unknown', title: 'Unknown', iconName: 'faNotReal', badges: [] }
    ]
  }
}));

import Badges from '../Badges';

describe('Badges icon mapping', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('maps known iconName to the expected icon and falls back on unknown', async () => {
    render(<Badges />);
    // Two headings visible
    expect(screen.getByRole('heading', { name: /Stats/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Unknown/ })).toBeInTheDocument();

    const icons = screen.getAllByTestId('fa');
    // first should be chart-line, second falls back to faCogs (iconName 'gears' in FA v6)
    const names = icons.map((n) => (n as HTMLElement).getAttribute('data-icon'));
    expect(names).toContain('chart-line');
    expect(names).toContain('gears');
  });
});
