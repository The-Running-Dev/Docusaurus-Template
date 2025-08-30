/**
 * GitHub Configuration Validation Utilities
 *
 * Provides validation and loading utilities for the GitHub configuration system.
 * Ensures configuration integrity and provides helpful error messages.
 */

import { z } from 'zod';
import type { GitHubConfig } from './models';

// Zod schema for GitHub configuration validation
const GitHubUrlsSchema = z.object({
  repository: z.string().url('Repository URL must be valid'),
  issues: z.string().url('Issues URL must be valid'),
  discussions: z.string().url('Discussions URL must be valid'),
  docs: z.string().url('Docs URL must be valid'),
  pages: z.string().url('Pages URL must be valid'),
  packages: z.string().url('Packages URL must be valid'),
  api: z.string().url('API URL must be valid'),
  contributors: z.string().url('Contributors URL must be valid'),
  releases: z.string().url('Releases URL must be valid'),
  pulls: z.string().url('Pulls URL must be valid'),
  actions: z.string().url('Actions URL must be valid'),
  readme: z.string().url('README URL must be valid'),
  avatar: z.string().url('Avatar URL must be valid')
});

const GitHubMetadataSchema = z.object({
  defaultBranch: z.string().min(1, 'Default branch cannot be empty'),
  license: z.string().min(1, 'License cannot be empty'),
  topics: z
    .array(z.string().min(1, 'Topic cannot be empty'))
    .min(1, 'At least one topic required'),
  description: z.string().min(1, 'Description cannot be empty')
});

const GitHubConfigSchema = z.object({
  repo: z
    .string()
    .regex(
      /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/,
      'Repo must be in owner/repo format'
    ),
  organization: z.string().min(1, 'Organization cannot be empty'),
  project: z.string().min(1, 'Project cannot be empty'),
  urls: GitHubUrlsSchema,
  metadata: GitHubMetadataSchema
});

/**
 * Validate GitHub configuration object
 * @param config - Configuration object to validate
 * @returns Validation result with success/error information
 */
export function validateGitHubConfig(
  config: unknown
): { success: true; data: GitHubConfig } | { success: false; error: string } {
  try {
    const validatedConfig = GitHubConfigSchema.parse(config);
    return { success: true, data: validatedConfig as GitHubConfig };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      return {
        success: false,
        // Keep message predictable and aligned with tests
        error: `validation failed: ${errorMessages}`
      };
    }
    return {
      success: false,
      error: `Unexpected Validation Error: ${String(error)}`
    };
  }
}

/**
 * Validate that all URLs in the configuration are accessible (basic format check)
 * @param config - GitHub configuration to validate
 * @returns Promise resolving to validation results
 */
export async function validateGitHubUrls(
  config: GitHubConfig
): Promise<{ valid: string[]; invalid: string[] }> {
  const valid: string[] = [];
  const invalid: string[] = [];

  // Basic URL validation (more comprehensive checks could be added)
  for (const [key, url] of Object.entries(config.urls)) {
    try {
      // Ensure url is a string before creating URL
      const urlString = String(url);
      new URL(urlString);
      // Additional GitHub-specific validation
      if (
        urlString.includes('github.com') ||
        urlString.includes('api.github.com') ||
        key === 'pages'
      ) {
        valid.push(key);
      } else {
        invalid.push(`${key}: Not a GitHub URL`);
      }
    } catch {
      invalid.push(`${key}: Invalid URL Format`);
    }
  }

  return { valid, invalid };
}

/**
 * Check if repository format is valid
 * @param repo - Repository string to validate
 * @returns True if valid owner/repo format
 */
export function isValidRepoFormat(repo: string): boolean {
  return /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo);
}

/**
 * Extract organization and project from repo string
 * @param repo - Repository in owner/repo format
 * @returns Object with organization and project, or null if invalid
 */
export function parseRepoString(
  repo: string
): { organization: string; project: string } | null {
  if (!isValidRepoFormat(repo)) {
    return null;
  }

  const [organization, project] = repo.split('/');
  return { organization, project };
}

/**
 * Generate GitHub URLs based on repository information
 * @param repo - Repository in owner/repo format
 * @param options - Additional options for URL generation
 * @returns Generated URLs object
 */
export function generateGitHubUrls(
  repo: string,
  options: {
    pagesUrl?: string;
    defaultBranch?: string;
    packagesPath?: string;
  } = {}
): GitHubConfig['urls'] {
  const {
    pagesUrl,
    defaultBranch = 'main',
    packagesPath = '/packages'
  } = options;
  const baseUrl = `https://github.com/${repo}`;
  const apiUrl = `https://api.github.com/repos/${repo}`;
  const [organization] = repo.split('/');

  return {
    repository: baseUrl,
    issues: `${baseUrl}/issues`,
    discussions: `${baseUrl}/discussions`,
    docs: `${baseUrl}#readme`,
    pages:
      pagesUrl ||
      `https://${organization.toLowerCase()}.github.io/${repo.split('/')[1]}`,
    packages: `${baseUrl}${packagesPath}`,
    api: apiUrl,
    contributors: `${baseUrl}/contributors`,
    releases: `${baseUrl}/releases`,
    pulls: `${baseUrl}/pulls`,
    actions: `${baseUrl}/actions`,
    readme: `${baseUrl}/blob/${defaultBranch}/README.md`,
    avatar: `https://github.com/${organization}.png`
  };
}

/**
 * Create a configuration template with placeholder values
 * @param repo - Repository in owner/repo format
 * @param options - Additional template options
 * @returns Configuration template
 */
export function createGitHubConfigTemplate(
  repo: string,
  options: {
    license?: string;
    description?: string;
    topics?: string[];
    pagesUrl?: string;
    defaultBranch?: string;
  } = {}
): GitHubConfig {
  const parsed = parseRepoString(repo);
  if (!parsed) {
    // Match the expected error phrasing in tests
    throw new Error('Invalid repository format');
  }

  const {
    license = 'MIT',
    description = 'A modern project built with best practices',
    topics = ['typescript', 'documentation'],
    pagesUrl,
    defaultBranch = 'main'
  } = options;

  return {
    repo,
    organization: parsed.organization,
    project: parsed.project,
    urls: generateGitHubUrls(repo, { pagesUrl, defaultBranch }),
    metadata: {
      defaultBranch,
      license,
      topics,
      description
    }
  };
}

/**
 * Validate configuration at build time (throws on validation failure)
 * @param config - Configuration to validate
 * @throws Error if validation fails
 */
export function assertValidGitHubConfig(
  config: unknown
): asserts config is GitHubConfig {
  const result = validateGitHubConfig(config);

  if (!result.success) {
    throw new Error((result as { success: false; error: string }).error);
  }
}

// Export schemas for external use
export { GitHubConfigSchema, GitHubUrlsSchema, GitHubMetadataSchema };
