import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Enable feature
vi.mock('../../../config/FeaturesConfig', () => ({
  Features: { GitHubLinks: 0 },
  useFeatureFlag: () => true
}));

// Mock NavBarLinks to a simple marker
vi.mock('../../NavBarLinks', () => ({
  __esModule: true,
  default: ({ enabled }: any) => <div>NavBarLinks enabled:{String(enabled)}</div>
}));

import GitHubLinks from '../GitHubLinks';

describe('GitHubLinks', () => {
  it('renders NavBarLinks when feature is enabled', () => {
    render(<GitHubLinks />);
    expect(screen.getByText(/NavBarLinks enabled:true/)).toBeInTheDocument();
  });
});

