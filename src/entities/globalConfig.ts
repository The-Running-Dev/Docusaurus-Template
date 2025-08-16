import { FeaturesConfig } from 'src/config/FeaturesConfig';

/**
 * Global Configuration Interface
 * Main configuration object for the entire application
 */
export interface GlobalConfig {
  /** Pre-build configuration (optional) */
  preBuild: PreBuildConfig;

  /** Site configuration (optional) */
  site: SiteConfig;

  /** Theme configuration (optional) */
  theme?: ThemeConfig;

  /** Features configuration (optional) */
  features?: FeaturesConfig;

  /** Projects configuration (optional) */
  projects?: ProjectsConfig;
}

/**
 * Pre-build Configuration
 * Controls build-time settings and behavior
 */
export interface PreBuildConfig {
  /** Project root directory path (relative or absolute) */
  projectRoot: string;

  /** Whether to overwrite existing files during build */
  overwriteExistingFiles: boolean;

  /** Whether to copy Markdown files from the project root */
  copyMarkdownFromProjectRoot: boolean;

  /** Whether to generate a navigation bar for pages in src/pages */
  generateNavBarForPages: boolean;

  /** Default theme to use when no theme is selected */
  defaultTheme: string;
}

/**
 * Site Configuration
 * Core site settings and metadata
 */
export interface SiteConfig {
  /** Site title */
  title: string;

  /** Site tagline or description */
  tagline: string;

  /** Site URL (production URL) */
  url: string;

  /** Base URL path (usually '/') */
  baseUrl: string;

  /** GitHub organization or user name */
  organizationName: string;

  /** GitHub project/repository name */
  projectName: string;
}

/**
 * Theme Configuration
 * Defines theme-related settings and UI components
 */
export interface ThemeConfig {
  /** Navbar configuration */
  navbar: NavbarConfig;
}

/**
 * Logo Configuration
 * Defines logo settings for navbar and other components
 */
export interface LogoConfig {
  /** Alt text for the logo image */
  alt: string;

  /** Source path for the logo image */
  src: string;
}

/**
 * Navbar Configuration
 * Defines navigation bar settings and appearance
 */
export interface NavbarConfig {
  /** Title displayed in the navbar */
  title: string;

  /** Logo configuration for the navbar */
  logo: LogoConfig;
}

/**
 * Projects Configuration
 * Defines how projects data is loaded and accessed
 */
export interface ProjectsConfig {
  /** Data provider type - 'json' for static JSON files, 'http' for API */
  provider: 'json' | 'http';

  /** Location of the data - file path for 'json', URL for 'http' */
  location: string;
}
