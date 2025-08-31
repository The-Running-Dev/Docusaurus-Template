import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import Badges, { DEFAULT_BADGES_DATA, schemaKey, BadgeConfigSchema } from '../index';
import { render } from '@testing-library/react';

// Keep DOM simple for rendering
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa" />
}));

// Stub DataProvider for a trivial render
vi.mock('../../DataProvider/DataProvider', () => ({
  __esModule: true,
  default: ({ children, processor }: any) => children(processor({ badgeCategories: [], templateVariables: {} }), false, null)
}));

describe('Badges index exports', () => {
  it('exposes default component and named exports', () => {
    expect(typeof Badges).toBe('function');
    expect(schemaKey).toBe('badgeConfig');
    expect(BadgeConfigSchema).toBeDefined();
    expect(DEFAULT_BADGES_DATA).toBeDefined();
  });

  it('renders the default export without crashing', () => {
    // With empty categories, component returns null
    const { container } = render(<Badges />);
    expect(container.firstChild).toBeNull();
  });
});

