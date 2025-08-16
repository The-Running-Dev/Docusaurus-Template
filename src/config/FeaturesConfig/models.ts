/**
 * Features Configuration Models
 *
 * Defines the structure and validation for application feature flags.
 */

export enum Features {
  GiscusComments,
  GitHubLinks,
  NavBarLinks,
  ThemeSwitcher,
  TextSizeSwitcher,
  ReaderMode,
  VersionDisplay,
  CVPage,
  PortfolioPage,
  ProjectsPage,
  PortfolioPageAsIndex,
  DataCaching
}

/**
 * Features Configuration Interface
 * Defines all available feature flags in the application.
 */
export interface FeaturesConfig {
  /** Whether to show Giscus comments on pages */
  giscusComments: boolean;

  /** Whether to show GitHub links in navbar */
  gitHubLinks: boolean;

  /** Whether to show navigation links in navbar */
  navBarLinks: boolean;

  /** Whether to show theme switcher in navbar */
  themeSwitcher: boolean;

  /** Whether to show text size switcher in navbar */
  textSizeSwitcher: boolean;

  /** Whether to show reader mode toggle in navbar */
  readerMode: boolean;

  /** Whether to show version display in navbar */
  versionDisplay: boolean;

  /** Whether to show CV page in navbar */
  cvPage: boolean;

  /** Whether to show Portfolio page in navbar */
  portfolioPage: boolean;

  /** Whether to show Projects page in navbar */
  projectsPage: boolean;

  /** Whether to use Portfolio page as the index page instead of simple welcome page */
  portfolioPageAsIndex: boolean;

  /** Whether to enable data caching for improved performance */
  dataCaching: boolean;
}

/**
 * Mapping between Features enum values and FeaturesConfig property names
 */
export const FeatureToConfigMap: Record<Features, keyof FeaturesConfig> = {
  [Features.GiscusComments]: 'giscusComments',
  [Features.GitHubLinks]: 'gitHubLinks',
  [Features.NavBarLinks]: 'navBarLinks',
  [Features.ThemeSwitcher]: 'themeSwitcher',
  [Features.TextSizeSwitcher]: 'textSizeSwitcher',
  [Features.ReaderMode]: 'readerMode',
  [Features.VersionDisplay]: 'versionDisplay',
  [Features.CVPage]: 'cvPage',
  [Features.PortfolioPage]: 'portfolioPage',
  [Features.ProjectsPage]: 'projectsPage',
  [Features.PortfolioPageAsIndex]: 'portfolioPageAsIndex',
  [Features.DataCaching]: 'dataCaching'
};

/**
 * Validates that a configuration object matches the FeaturesConfig interface
 * @param config - Configuration object to validate
 * @returns True if valid, throws error if invalid
 */
export function validateFeaturesConfig(config: any): config is FeaturesConfig {
  const requiredBooleanFields: (keyof FeaturesConfig)[] = [
    'giscusComments',
    'gitHubLinks',
    'navBarLinks',
    'themeSwitcher',
    'textSizeSwitcher',
    'readerMode',
    'versionDisplay',
    'cvPage',
    'portfolioPage',
    'portfolioPageAsIndex',
    'projectsPage',
    'dataCaching'
  ];

  for (const field of requiredBooleanFields) {
    if (typeof config[field] !== 'boolean') {
      throw new Error(
        `FeaturesConfig Validation Failed: ${field} Must be a Boolean, Got ${typeof config[field]}`
      );
    }
  }

  return true;
}

/**
 * Type guard for FeaturesConfig
 */
export function isFeaturesConfig(obj: any): obj is FeaturesConfig {
  try {
    return validateFeaturesConfig(obj);
  } catch {
    return false;
  }
}
