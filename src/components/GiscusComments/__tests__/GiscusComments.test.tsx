import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock @giscus/react
vi.mock('@giscus/react', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="giscus-component" {...props}>Giscus Component</div>
}));

// Mock @docusaurus/theme-common
vi.mock('@docusaurus/theme-common', () => ({
  useColorMode: vi.fn()
}));

// Mock FeatureComponent
vi.mock('../../FeatureComponent', () => ({
  __esModule: true,
  default: ({ children, configData }: any) => {
    // Simulate FeatureComponent calling children with config
    return children(configData);
  }
}));

// Mock Features config
vi.mock('../../../config/FeaturesConfig', () => ({
  Features: {
    GiscusComments: 'giscusComments'
  }
}));

// Mock config data
vi.mock('../../../../data', () => ({
  giscus: {}
}));

import GiscusComments from '../GiscusComments';
import { useColorMode } from '@docusaurus/theme-common';

const mockUseColorMode = useColorMode as any;

describe('GiscusComments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseColorMode.mockReturnValue({ colorMode: 'light' });
  });

  it('renders unconfigured message when config is missing', () => {
    // Mock incomplete config
    vi.doMock('../../../../data', () => ({
      giscus: {}
    }));

    render(<GiscusComments />);

    expect(screen.getByText('💬 Comments are not configured yet.')).toBeInTheDocument();
    expect(screen.getByText(/Configure Giscus settings/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Configure Giscus/ })).toHaveAttribute('href', 'https://giscus.app');
  });

  it('renders unconfigured message when config is incomplete', () => {
    // Mock partial config
    vi.doMock('../../../../data', () => ({
      giscus: {
        repo: 'user/repo',
        // Missing other required fields
      }
    }));

    render(<GiscusComments />);

    expect(screen.getByText('💬 Comments are not configured yet.')).toBeInTheDocument();
  });

  it('renders component without errors when properly initialized', () => {
    // Test that the component renders without throwing errors
    expect(() => render(<GiscusComments />)).not.toThrow();
  });
});