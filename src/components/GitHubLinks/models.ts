import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface GitHubLink {
  /** URL for the link */
  href: string;

  /** Display label for the link */
  label: string;

  /** Position in navbar (usually 'right') */
  position?: 'left' | 'right';

  /** Whether to open in new tab */
  target?: '_blank' | '_self';

  /** Tooltip text on hover */
  title?: string;

  /** Custom CSS class for styling */
  className?: string;

  /** FontAwesome icon definition */
  icon?: string | IconDefinition;
}

export interface GitHubLinksConfig {
  /** Override the default configuration */
  links?: GitHubLink[]; // Raw data from JSON uses string icons

  /** Whether to show as dropdown */
  dropdown?: boolean;

  /** Custom CSS class */
  className?: string;

  /** Dropdown label (only used if dropdown is true) */
  dropdownLabel?: string;

  /** Whether to show icons */
  showIcons?: boolean;
}
