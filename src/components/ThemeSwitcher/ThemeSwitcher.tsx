import React, { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/core/lib/client/exports/useBaseUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette } from '@fortawesome/free-solid-svg-icons';

import { Features, useFeatureFlag } from '../../config/FeaturesConfig';
import { Theme } from './models';
import { themes, defaultTheme } from './themes';

import './ThemeSwitcher.css';

/**
 * Theme Switcher Component
 * Allows users to switch between different themes
 */
const ThemeSwitcher: React.FC = () => {
  const isEnabled = useFeatureFlag(Features.ThemeSwitcher);

  if (!isEnabled) {
    return null;
  }

  return <ThemeSwitcherContent themes={themes} defaultTheme={defaultTheme} />;
};

/**
 * Internal component that renders the actual theme switcher UI
 */
const ThemeSwitcherContent: React.FC<{
  themes: Theme[];
  defaultTheme: Theme;
}> = ({ themes, defaultTheme }) => {
  // Don't render if no themes
  if (!themes || themes.length === 0) {
    return null;
  }

  const [currentTheme, setCurrentTheme] = useState<string>(defaultTheme.name);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Pre-compute resolved URLs for all themes
  const themesWithResolvedUrls = themes.map((theme) => ({
    ...theme,
    resolvedCssUrl: useBaseUrl(theme.cssFile)
  }));

  useEffect(() => {
    // Load saved theme from localStorage, fallback to defaultTheme
    const savedTheme =
      localStorage.getItem('docusaurus-theme-color') || defaultTheme.name;

    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, [themesWithResolvedUrls]);

  const applyTheme = (themeName: string) => {
    // Remove existing theme links
    const existingLinks = document.querySelectorAll(
      'link[data-theme-switcher]'
    );
    existingLinks.forEach((link) => link.remove());

    // Find the theme with resolved URL
    const theme = themesWithResolvedUrls.find((t) => t.name === themeName);

    if (!theme) return;

    // Add new theme link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = theme.resolvedCssUrl;
    link.setAttribute('data-theme-switcher', 'true');

    document.head.appendChild(link);

    // Save to localStorage
    localStorage.setItem('docusaurus-theme-color', themeName);

    setCurrentTheme(themeName);
  };

  const handleThemeChange = (themeName: string) => {
    applyTheme(themeName);
    setIsOpen(false);
  };

  const currentThemeDisplayName =
    themesWithResolvedUrls.find((t) => t.name === currentTheme)?.displayName ||
    defaultTheme.displayName;

  return (
    <div
      className="theme-switcher"
      onBlur={(e) => {
        // Close dropdown when focus leaves the component
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsOpen(false);
        }
      }}
      tabIndex={-1}
    >
      <button
        className="theme-switcher__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch Theme"
        title={`Current: ${currentThemeDisplayName}`}
      >
        <FontAwesomeIcon icon={faPalette} />
      </button>

      {isOpen && (
        <div className="theme-switcher__dropdown">
          <div className="theme-switcher__header">Themes</div>
          {themesWithResolvedUrls.map((theme) => (
            <button
              key={theme.name}
              className={`theme-switcher__option ${
                currentTheme === theme.name
                  ? 'theme-switcher__option--active'
                  : ''
              }`}
              onClick={() => handleThemeChange(theme.name)}
            >
              <span
                className={`theme-switcher__color-preview theme-switcher__color-preview--${theme.name}`}
              ></span>
              {theme.displayName}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="theme-switcher__backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
