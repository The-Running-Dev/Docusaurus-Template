import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock baseUrl resolver to identity
vi.mock('@docusaurus/core/lib/client/exports/useBaseUrl', () => ({ default: (p: string) => p }));

const THEMES = [
  { name: 'default', displayName: 'Default', cssFile: '/themes/default.css' },
  { name: 'dark', displayName: 'Dark', cssFile: '/themes/dark.css' }
] as any;

describe('useThemeInitialization / ThemeInitializer', () => {
  beforeEach(() => {
    // Cleanup head and storage
    document.querySelectorAll('link[data-theme-switcher]').forEach((el) => el.remove());
    localStorage.clear();
    vi.resetModules();
  });

  it('applies default theme when switcher disabled and no saved theme', async () => {
    vi.mock('../../config/FeaturesConfig', () => ({ useFeaturesConfig: () => ({ themeSwitcher: false } as any) }));
    const { ThemeInitializer } = await import('../useThemeInitialization');

    render(<ThemeInitializer themes={THEMES} defaultTheme={THEMES[0]} />);

    const link = document.querySelector('link[data-theme-switcher]') as HTMLLinkElement;
    expect(link).toBeTruthy();
    expect(link.href).toContain(THEMES[0].cssFile);
    // Do not assert localStorage in this case as feature flag may enable saving
  });

  it('applies saved theme when switcher enabled', async () => {
    localStorage.setItem('docusaurus-theme-color', 'dark');
    vi.mock('../../config/FeaturesConfig', () => ({ useFeaturesConfig: () => ({ themeSwitcher: true } as any) }));
    const { ThemeInitializer } = await import('../useThemeInitialization');

    render(<ThemeInitializer themes={THEMES} defaultTheme={THEMES[0]} />);

    const link = document.querySelector('link[data-theme-switcher]') as HTMLLinkElement;
    expect(link).toBeTruthy();
    expect(link.href).toContain('/themes/dark.css');
    expect(localStorage.getItem('docusaurus-theme-color')).toBe('dark');
  });

  it('does nothing if theme link already exists', async () => {
    const pre = document.createElement('link');
    pre.setAttribute('data-theme-switcher', 'true');
    pre.rel = 'stylesheet';
    pre.href = '/themes/placeholder.css';
    document.head.appendChild(pre);

    vi.mock('../../config/FeaturesConfig', () => ({ useFeaturesConfig: () => ({ themeSwitcher: true } as any) }));
    const { ThemeInitializer } = await import('../useThemeInitialization');

    render(<ThemeInitializer themes={THEMES} defaultTheme={THEMES[0]} />);
    const links = document.querySelectorAll('link[data-theme-switcher]');
    expect(links.length).toBe(1);
    expect((links[0] as HTMLLinkElement).href).toContain('/themes/placeholder.css');
  });
});
