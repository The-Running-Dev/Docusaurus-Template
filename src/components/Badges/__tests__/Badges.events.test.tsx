import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

// Mock FontAwesome (not used directly here but keeps DOM predictable)
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa" />
}));

// Mock DataProvider to synchronously feed default data through processor
vi.mock('../../DataProvider/DataProvider', () => ({
  __esModule: true,
  default: ({ children, processor, defaultData }: any) =>
    children(processor(defaultData), false, null)
}));

// Provide badges with at least one item to exercise mouse events
vi.mock('../constants', () => ({
  DEFAULT_BADGES_DATA: {
    templateVariables: { user: 'u', repository: 'r' },
    badgeCategories: [
      {
        key: 'ci',
        title: 'CI',
        iconName: 'faCogs',
        badges: [
          {
            name: 'Build',
            url: 'https://img.shields.io/badge/{user}-{repository}-brightgreen',
            link: 'https://github.com/{user}/{repository}'
          }
        ]
      }
    ]
  }
}));

import Badges from '../Badges';

describe('Badges item hover effects', () => {
  it('applies and removes transform on image hover', () => {
    const { container } = render(<Badges />);

    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();

    // Initial transform not set
    expect(img.style.transform).toBe('');

    // Simulate hover
    fireEvent.mouseOver(img);
    expect(img.style.transform).toBe('scale(1.05)');

    // Simulate mouse out
    fireEvent.mouseOut(img);
    expect(img.style.transform).toBe('scale(1)');
  });

  it('renders anchors with target and rel attributes', () => {
    const { container } = render(<Badges />);
    const a = container.querySelector('a') as HTMLAnchorElement;
    expect(a).toBeTruthy();
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toContain('noopener');
    expect(a.getAttribute('rel')).toContain('noreferrer');
  });
});
