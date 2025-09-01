import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock FontAwesome to avoid loading real icons
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa" />
}));

// Use a controllable DataProvider
vi.mock('../../DataProvider/DataProvider', () => ({
  __esModule: true,
  default: ({ children, processor, defaultData }: any) => children(processor ? processor(defaultData) : defaultData, false, null)
}));

// Provide default badges data shape
vi.mock('../constants', () => ({
  DEFAULT_BADGES_DATA: {
    templateVariables: { user: 'user', repository: 'repo', docsUrl: 'https://docs', demoUrl: 'https://demo' },
    badgeCategories: [
      {
        key: 'ci',
        title: 'CI',
        iconName: 'faCogs',
        badges: [
          { name: 'Build', url: 'https://img.shields.io/badge/{user}-{repository}-brightgreen', link: 'https://github.com/{user}/{repository}/actions' },
          { name: 'Docs', url: '{docsUrl}/badge.svg', link: '{docsUrl}' }
        ]
      },
      {
        key: 'pkg',
        title: 'Packages',
        iconName: 'faBoxOpen',
        badges: [{ name: 'NPM', url: 'https://img.shields.io/npm/v/{repository}', link: 'https://npmjs.com/{repository}' }]
      }
    ]
  }
}));

import Badges from '../Badges';

describe('Badges component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('renders processed badges with replaced template variables', async () => {
    const { container } = render(<Badges user="the-user" repository="the-repo" />);

    // Should render headings for categories
    expect(screen.getByRole('heading', { name: /CI/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Packages/ })).toBeInTheDocument();

    // All badges render as links with images
    const links = container.querySelectorAll('a[target="_blank"]');
    const imgs = container.querySelectorAll('img[alt]');
    expect(links.length).toBeGreaterThanOrEqual(3);
    expect(imgs.length).toBeGreaterThanOrEqual(3);

    // Template variables replaced in both url and link
    const buildImg = Array.from(imgs).find((img) => (img as HTMLImageElement).alt === 'Build') as HTMLImageElement;
    expect(buildImg.src).toContain('the-user');
    expect(buildImg.src).toContain('the-repo');

    const buildLink = Array.from(links).find((a) => (a as HTMLAnchorElement).href.includes('/the-user/the-repo/actions')) as HTMLAnchorElement;
    expect(buildLink).toBeTruthy();
  });

  it('filters categories by groups prop', async () => {
    const { container } = render(<Badges groups={['pkg']} />);
    // Only Packages heading should appear
    expect(screen.queryByRole('heading', { name: /CI/ })).toBeNull();
    expect(screen.getByRole('heading', { name: /Packages/ })).toBeInTheDocument();
    expect(container.querySelectorAll('img').length).toBe(1);
  });

  it('returns null when no categories after filtering', async () => {
    // Override constants to make categories all filtered out
    vi.doMock('../constants', () => ({ DEFAULT_BADGES_DATA: { templateVariables: {}, badgeCategories: [{ key: 'x', title: 'X', iconName: 'faCogs', badges: [] }] } }));
    const Mod = await import('../Badges');
    const { container } = render(<Mod.default groups={['nonexistent']} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows loading and error states from DataProvider', async () => {
    // Re-mock DataProvider to emit loading and error
    await vi.doMock('../../DataProvider/DataProvider', () => ({
      __esModule: true,
      default: ({ children }: any) => children(null, true, null)
    }));
    let Mod = await import('../Badges');
    const { rerender } = render(<Mod.default />);
    expect(screen.getByText(/Loading Badges/)).toBeInTheDocument();

    vi.resetModules();
    await vi.doMock('../../DataProvider/DataProvider', () => ({
      __esModule: true,
      default: ({ children }: any) => children(null, false, { message: 'bad' })
    }));
    Mod = await import('../Badges');
    rerender(<Mod.default />);
    // The error message contains 'Error loading badges: bad' text
    expect(screen.getByText((t) => t.includes('Error loading badges:') && t.includes('bad'))).toBeInTheDocument();
  });
});
