import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

/**
 * NavBarLinksConfig interface
 * Represents the configuration for the navbar links.
 */
export interface NavBarLinksConfig {
  /** Links to display in the navbar */
  links?: CustomNavBarLink[];

  /** Whether to show as dropdown */
  dropdown?: boolean;

  /** Custom CSS class */
  className?: string;

  /** Dropdown label (only used if dropdown is true) */
  dropdownLabel?: string;

  /** Whether to show icons */
  showIcons?: boolean;
}

/**
 * CustomNavBarLink interface
 * Represents a single link in the navbar with all its properties.
 */
export interface CustomNavBarLink {
  /** URL for the link */
  href: string;

  /** Display label for the link */
  label: string;

  /** Position in navbar - defaults to 'left' when not provided */
  position?: 'left' | 'right';

  /** Whether to open in new tab */
  target?: '_blank' | '_self';

  /** Tooltip text on hover */
  title?: string;

  /** Custom CSS class for styling */
  className?: string;

  /** FontAwesome icon definition or string icon name for dynamic resolution */
  icon?: IconDefinition | string;
}

/**
 * Props for the NavBarLinks component
 */
export interface NavBarLinksProps {
  /** Optional configuration - if not provided, uses default config from file */
  config?: NavBarLinksConfig;

  /** Whether the component is enabled - if not provided, uses feature flag */
  enabled?: boolean;
}

/**
 * Utility function to ensure position defaults to 'left'
 * @param link - The navbar link to process
 * @returns The link with position defaulted to 'left' if not specified
 */
export const withDefaultPosition = (
  link: CustomNavBarLink
): CustomNavBarLink => ({
  ...link,
  position: link.position || 'left'
});
