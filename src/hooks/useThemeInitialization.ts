import React, { useEffect } from 'react';
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

  // Pre-compute resolved URLs for all themes
  const themesWithResolvedUrls: ThemeWithResolvedUrl[] = themes.map(
    (theme) => ({
      ...theme,
      resolvedCssUrl: useBaseUrl(theme.cssFile)
    })
  );

  const defaultThemeWithUrl: ThemeWithResolvedUrl = {
    ...defaultTheme,
    resolvedCssUrl: useBaseUrl(defaultTheme.cssFile)
  };

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
    featuresConfig.themeSwitcher
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
