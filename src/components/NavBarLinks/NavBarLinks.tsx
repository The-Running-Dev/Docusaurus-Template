import React, { useState, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faBars } from '@fortawesome/free-solid-svg-icons';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import * as brandIcons from '@fortawesome/free-brands-svg-icons';
import Link from '@docusaurus/Link';
// import { useLocation } from '@docusaurus/router';

import FeatureComponent from '../FeatureComponent';
import { Features } from '../../config/FeaturesConfig';
import {
  CustomNavBarLink,
  NavBarLinksConfig,
  NavBarLinksProps,
  withDefaultPosition
} from './models';

// @ts-ignore
import { navBarLinks as configData } from '../../../data';

import './NavBarLinks.css';

/**
 * Determines if a URL is external (requires full page navigation)
 * @param href - The URL to check
 * @returns true if the URL is external, false if internal
 */
const isExternalUrl = (href: string): boolean => {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('ftp://')
  );
};

/**
 * NavBarLinks Component
 *
 * A generic navigation component that renders links in navbar format with optional dropdown.
 * Supports dynamic FontAwesome icon resolution from string names or IconDefinition objects.
 *
 * Features:
 * - Dynamic icon resolution from solid and brand FontAwesome packages
 * - Automatic external/internal link detection (uses Docusaurus Link for internal routes)
 * - Dropdown menu support with hover interactions
 * - Configurable via props or default JSON configuration
 * - Performance optimized with memoization
 * - Delegated enabled/disabled control to parent components
 *
 * @param config - Optional configuration object. If not provided, uses default config from file.
 * @param enabled - Whether component is enabled. If not provided, uses enableNavBarLinks feature flag.
 */
const NavBarLinks: React.FC<NavBarLinksProps> = ({ config, enabled }) => {
  // If enabled prop is explicitly provided, use traditional logic
  if (enabled !== undefined) {
    return config ? (
      <NavBarLinksContent config={config} enabled={enabled} />
    ) : null;
  }

  // Otherwise use FeatureComponent pattern
  return (
    <FeatureComponent feature={Features.NavBarLinks} configData={configData}>
      {(data) => <NavBarLinksContent config={data} enabled={true} />}
    </FeatureComponent>
  );
};

/**
 * Internal component that renders the actual navigation UI
 */
const NavBarLinksContent: React.FC<{
  config: NavBarLinksConfig;
  enabled: boolean;
}> = ({ config: activeConfig, enabled }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { pathname } =
    typeof window !== 'undefined'
      ? { pathname: window.location.pathname }
      : { pathname: '/' };

  // Apply default position to all links
  const processedConfig = useMemo(
    () => ({
      ...activeConfig,
      links: activeConfig.links?.map(withDefaultPosition) || []
    }),
    [activeConfig]
  );

  // Early return if not enabled or no links to display
  if (
    !enabled ||
    !processedConfig.links ||
    processedConfig.links.length === 0
  ) {
    return null;
  }

  // Check if a link is currently active based on pathname
  const isLinkActive = useCallback(
    (href: string): boolean => {
      // Exact match for the current pathname
      if (pathname === href) return true;

      // For nested paths, check if current path starts with the link path
      // but avoid matching root "/" with everything
      if (href !== '/' && pathname.startsWith(href)) {
        return true;
      }

      return false;
    },
    [pathname]
  );

  // Memoized icon resolver - prevents recreation on every render
  const resolveIcon = useCallback(
    (iconName: string): IconDefinition | undefined => {
      // Try solid icons first (most common)
      if (solidIcons[iconName as keyof typeof solidIcons]) {
        return solidIcons[
          iconName as keyof typeof solidIcons
        ] as IconDefinition;
      }

      // Then try brand icons
      if (brandIcons[iconName as keyof typeof brandIcons]) {
        return brandIcons[
          iconName as keyof typeof brandIcons
        ] as IconDefinition;
      }

      return undefined;
    },
    []
  );

  // Memoized container class
  const containerClass = useMemo(
    () =>
      [
        'navbar-links',
        processedConfig.dropdown && 'navbar-links--dropdown',
        processedConfig.className
      ]
        .filter(Boolean)
        .join(' '),
    [processedConfig.dropdown, processedConfig.className]
  );

  const renderIcon = (icon?: IconDefinition | string) => {
    if (!processedConfig.showIcons || !icon) return null;

    // If icon is a string, try to resolve it dynamically
    const resolvedIcon = typeof icon === 'string' ? resolveIcon(icon) : icon;

    // Only render if we have a valid icon
    if (!resolvedIcon) return null;

    return (
      <FontAwesomeIcon icon={resolvedIcon} className="navbar-links__icon" />
    );
  };

  const renderLink = (
    link: CustomNavBarLink,
    isDropdownItem = false,
    key?: string
  ) => {
    const isActive = !isExternalUrl(link.href) && isLinkActive(link.href);
    const linkClass = [
      isDropdownItem ? 'navbar-links__dropdown-item' : 'navbar-links__link',
      isActive && 'navbar-links__link--active',
      link.className
    ]
      .filter(Boolean)
      .join(' ');

    const isExternal = isExternalUrl(link.href);

    // Common content for both internal and external links
    const linkContent = (
      <>
        {renderIcon(link.icon)}
        <span>{link.label}</span>
        {isExternal && (
          <svg
            width="13.5"
            height="13.5"
            aria-hidden="true"
            className="iconExternalLink_qCNR"
          >
            <use href="#theme-svg-external-link" />
          </svg>
        )}
      </>
    );

    if (isExternal) {
      // Use regular anchor tag for external links
      return (
        <a
          key={key || link.href}
          href={link.href}
          className={linkClass}
          title={link.title}
          target={link.target || '_blank'}
          rel="noopener noreferrer"
        >
          {linkContent}
        </a>
      );
    }

    // Use Docusaurus Link for internal navigation (client-side routing)
    return (
      <Link
        key={key || link.href}
        to={link.href}
        className={linkClass}
        title={link.title}
      >
        {linkContent}
      </Link>
    );
  };

  if (processedConfig.dropdown) {
    return (
      <div
        className={containerClass}
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <button
          className="navbar-links__dropdown-toggle"
          type="button"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <FontAwesomeIcon icon={faBars} className="navbar-links__icon" />
          <span>{processedConfig.dropdownLabel || 'Menu'}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className="navbar-links__icon"
          />
        </button>
        <div className="navbar-links__dropdown-menu">
          {processedConfig.links.map((link) =>
            renderLink(link, true, link.href)
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {processedConfig.links.map((link) => renderLink(link, false, link.href))}
    </div>
  );
};

export default NavBarLinks;
