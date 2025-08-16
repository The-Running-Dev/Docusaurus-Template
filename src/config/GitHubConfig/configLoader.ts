/**
 * GitHub Configuration Loader
 *
 * Single source of truth for GitHub configuration that loads from YAML→JSON
 * and provides validation for both application and test environments.
 *
 * This consolidates the parallel config systems into one authoritative path:
 * YAML (config/gitHub.yml) → JSON (data/gitHub.json) → Validated Config
 */

import { getData } from '../../data/dataLoader';
import type { GitHubConfig } from './models';
import { validateGitHubConfig } from './validation';

// @ts-ignore
import { gitHub as configData } from '../../../data';

// Cache for validated configuration
let validatedConfig: GitHubConfig | null = null;
let configError: string | null = null;

/**
 * Get the GitHub configuration with validation and caching
 *
 * This is the single authoritative source for GitHub configuration
 * that both the app and tests should use.
 *
 * @returns {GitHubConfig} Validated and immutable GitHub configuration
 * @throws {Error} If configuration is invalid or cannot be loaded
 */
export function getGitHubConfig(): GitHubConfig {
  // Return cached config if available
  if (validatedConfig) {
    return validatedConfig;
  }

  // Return cached error if previous load failed
  if (configError) {
    throw new Error(configError);
  }

  try {
    // Load configuration from generated JSON data
    const rawConfig = getData<GitHubConfig>(configData);

    // Validate configuration using Zod schema
    const validationResult = validateGitHubConfig(rawConfig);

    if (!validationResult.success) {
      // Type assertion is safe here because we checked !success
      const failureResult = validationResult as {
        success: false;
        error: string;
      };
      configError = `GitHub Configuration Validation Failed: ${failureResult.error}`;

      throw new Error(configError);
    }

    // At this point, validationResult.success is true, so data is available
    const validatedData = validationResult.data;

    // Ensure immutability of the validated configuration
    const config = Object.freeze({
      ...validatedData,
      urls: Object.freeze(validatedData.urls),
      metadata: Object.freeze({
        ...validatedData.metadata,
        topics: Object.freeze(validatedData.metadata.topics)
      }),
      features: validatedData.features
        ? Object.freeze(validatedData.features)
        : undefined,
      integrations: validatedData.integrations
        ? Object.freeze(validatedData.integrations)
        : undefined
    });

    // Cache the validated configuration
    validatedConfig = config;

    return config;
  } catch (error) {
    configError =
      error instanceof Error
        ? `Failed to Load GitHub Configuration: ${error.message}`
        : `Failed to Load GitHub Configuration: ${String(error)}`;

    throw new Error(configError);
  }
}

/**
 * Reset the configuration cache
 *
 * Useful for testing environments where you need to reload configuration
 * or when configuration files have been updated.
 */
export function resetGitHubConfigCache(): void {
  validatedConfig = null;
  configError = null;
}

/**
 * Check if configuration is currently cached
 *
 * @returns {boolean} True if configuration is cached and valid
 */
export function isGitHubConfigCached(): boolean {
  return validatedConfig !== null;
}

/**
 * Get repository information from configuration
 *
 * @returns {object} Repository information
 */
export function getRepositoryInfo() {
  const config = getGitHubConfig();

  return {
    repo: config.repo,
    organization: config.organization,
    project: config.project,
    defaultBranch: config.metadata.defaultBranch
  };
}

/**
 * Get all GitHub URLs from configuration
 *
 * @returns {object} All GitHub URLs
 */
export function getGitHubUrls() {
  const config = getGitHubConfig();

  return config.urls;
}

/**
 * Get project metadata from configuration
 *
 * @returns {object} Project metadata
 */
export function getProjectMetadata() {
  const config = getGitHubConfig();

  return config.metadata;
}

/**
 * Get specific GitHub URL by key
 * @param key - URL key to retrieve
 * @returns URL string
 */
export function getGitHubUrl(key: keyof GitHubConfig['urls']): string {
  const urls = getGitHubUrls();

  return urls[key];
}

/**
 * Build repository URL with optional path
 * @param path - Optional path to append
 * @returns Repository URL
 */
export function getRepositoryUrl(path?: string): string {
  const urls = getGitHubUrls();
  const baseUrl = urls.repository;

  if (!path) return baseUrl;

  // Handle different path formats
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
}

/**
 * Build API URL with optional endpoint
 * @param endpoint - Optional API endpoint
 * @returns API URL
 */
export function getApiUrl(endpoint?: string): string {
  const urls = getGitHubUrls();
  const baseUrl = urls.api;

  if (!endpoint) return baseUrl;

  // Handle different endpoint formats
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${baseUrl}${cleanEndpoint}`;
}
