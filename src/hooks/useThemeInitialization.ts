import React, { useEffect, useMemo } from 'react';
import useBaseUrl from '@docusaurus/core/lib/client/exports/useBaseUrl';
import { Theme } from '../components/ThemeSwitcher/models';
import { useFeaturesConfig } from '../config/FeaturesConfig';

// Extended theme interface with resolved URL
interface ThemeWithResolvedUrl extends Theme {
  resolvedCssUrl: string;
}

/**
 * Custom hook that ensures the default theme is applied on page load
 * This runs independently of the ThemeSwitcher component visibility
 *
 * @param themes - Array of available themes
 * @param defaultTheme - The default theme to apply
 */
export const useThemeInitialization = (
  themes: Theme[],
  defaultTheme: Theme
): void => {
  const featuresConfig = useFeaturesConfig();

  // Compute base once and resolve URLs without calling hooks in loops
  const baseUrl = useBaseUrl('/');
  const themesWithResolvedUrls: ThemeWithResolvedUrl[] = useMemo(
    () =>
      themes.map((theme) => ({
        ...theme,
        resolvedCssUrl: `${baseUrl.replace(/\/$/, '')}/${
          theme.cssFile.startsWith('/') ? theme.cssFile.slice(1) : theme.cssFile
        }`
      })),
    [themes, baseUrl]
  );

  const defaultThemeWithUrl: ThemeWithResolvedUrl = useMemo(
    () => ({
      ...defaultTheme,
      resolvedCssUrl: `${baseUrl.replace(/\/$/, '')}/${
        defaultTheme.cssFile.startsWith('/')
          ? defaultTheme.cssFile.slice(1)
          : defaultTheme.cssFile
      }`
    }),
    [defaultTheme, baseUrl]
  );

  useEffect(() => {
    // Only run on initial load - don't override user's saved theme
    const existingThemeLinks = document.querySelectorAll(
      'link[data-theme-switcher]'
    );
    const savedTheme = localStorage.getItem('docusaurus-theme-color');

    // If there's already a theme applied, don't interfere
    if (existingThemeLinks.length > 0) {
      return;
    }

    // Determine which theme to apply based on feature flag
    let themeToApply: string;

    if (featuresConfig.themeSwitcher && savedTheme) {
      // Theme switcher is enabled and user has a saved preference
      themeToApply = savedTheme;
    } else {
      // Theme switcher is disabled OR no saved theme - always use default
      themeToApply = defaultTheme.name;
    }

    const theme =
      themesWithResolvedUrls.find((t) => t.name === themeToApply) ||
      defaultThemeWithUrl;

    // Apply the theme
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = theme.resolvedCssUrl;
    link.setAttribute('data-theme-switcher', 'true');

    document.head.appendChild(link);

    // Only save to localStorage if theme switcher is enabled
    // This prevents overriding saved preferences when theme switcher is disabled
    if (featuresConfig.themeSwitcher && !savedTheme) {
      localStorage.setItem('docusaurus-theme-color', theme.name);
    }
  }, [
    themesWithResolvedUrls,
    defaultThemeWithUrl,
    featuresConfig.themeSwitcher,
    defaultTheme.name
  ]);
};

/**
 * Component that initializes themes without rendering any UI
 * This ensures default themes are applied even when themeSwitcher is disabled
 */
export const ThemeInitializer: React.FC<{
  themes: Theme[];
  defaultTheme: Theme;
}> = ({ themes, defaultTheme }) => {
  useThemeInitialization(themes, defaultTheme);

  return null; // Render nothing
};
