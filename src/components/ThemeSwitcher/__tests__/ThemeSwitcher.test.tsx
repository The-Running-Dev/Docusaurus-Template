import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock feature flag to enable component
vi.mock('../../../config/FeaturesConfig', () => ({
  Features: { ThemeSwitcher: 0 },
  useFeatureFlag: () => true
}));

// Mock useBaseUrl to return identity
vi.mock('@docusaurus/core/lib/client/exports/useBaseUrl', () => ({
  default: (p: string) => p
}));

import ThemeSwitcher from '../ThemeSwitcher';

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    // Clear any previous link elements/localStorage
    document.querySelectorAll('link[data-theme-switcher]').forEach((n) => n.remove());
    localStorage.clear();
  });

  it('opens dropdown and applies a theme', async () => {
    render(<ThemeSwitcher />);
    const button = screen.getByRole('button', { name: /Switch Theme/ });
    await userEvent.click(button);
    const option = await screen.findByRole('button', { name: /Default|Light|Dark/i });
    await userEvent.click(option);

    // Link tag injected
    const link = document.querySelector('link[data-theme-switcher]') as HTMLLinkElement;
    expect(link).toBeTruthy();
    expect(link.href).toContain('.css');
    // Preference saved
    expect(localStorage.getItem('docusaurus-theme-color')).toBeTruthy();
  });
});

