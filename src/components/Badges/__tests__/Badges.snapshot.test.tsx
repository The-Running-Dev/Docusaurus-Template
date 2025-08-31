import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa" />
}));

vi.mock('../../DataProvider/DataProvider', () => ({
  __esModule: true,
  default: ({ children, processor, defaultData }: any) => children(processor(defaultData), false, null)
}));

vi.mock('../constants', () => ({
  DEFAULT_BADGES_DATA: {
    templateVariables: { user: 'snap', repository: 'repo' },
    badgeCategories: [
      {
        key: 'ci',
        title: 'CI',
        iconName: 'faCogs',
        badges: [
          { name: 'Build', url: 'https://img.shields.io/{user}', link: 'https://github.com/{user}/{repository}' }
        ]
      }
    ]
  }
}));

import Badges from '../Badges';

describe('Badges structure snapshot (single category)', () => {
  it('matches expected structure for a simple category header and item', async () => {
    const { container } = render(<Badges />);
    // Snapshot only the header element for stability
    const header = container.querySelector('h3');
    expect(header).toMatchInlineSnapshot(`
      <h3
        style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--ifm-color-primary); border-bottom: 2px solid var(--ifm-color-primary-light); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"
      >
        <span
          data-testid="fa"
        />
        CI
      </h3>
    `);
    // And verify one badge anchor+image pair
    const a = container.querySelector('a') as HTMLAnchorElement;
    const img = container.querySelector('img') as HTMLImageElement;
    expect(a.href).toContain('github.com/snap/repo');
    expect(img.alt).toBe('Build');
    expect(img.src).toContain('img.shields.io/snap');
  });
});
