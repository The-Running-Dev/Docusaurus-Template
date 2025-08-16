/**
 * Projects Configuration Constants
 * Centralized constants for projects configuration across the application
 */

/** Default provider type for projects data */
export const DEFAULT_PROJECTS_PROVIDER: 'json' | 'http' = 'json';

/** Default location for projects data */
export const DEFAULT_PROJECTS_LOCATION = './data/projects.json';

/** Default projects configuration object */
export const DEFAULT_PROJECTS_CONFIG = {
  provider: DEFAULT_PROJECTS_PROVIDER,
  location: DEFAULT_PROJECTS_LOCATION
} as const;

// Re-export for convenience
export { DEFAULT_PROJECTS_CONFIG as PROJECTS_DEFAULTS };
