/**
 * Version Configuration Interface
 * Represents the structure of version configuration data from YAML/JSON
 */
export interface VersionConfig {
  /** Version string to display (if not provided, will use version from package.json) */
  version?: string;

  /** URL to link to when version is clicked (optional) */
  href?: string;

  /** Prefix text before version (e.g., 'v', 'Version ') */
  prefix?: string;

  /** Whether to show as a badge style */
  badge?: boolean;

  /** Custom CSS class for styling */
  className?: string;

  /** Tooltip text on hover */
  title?: string;
}
