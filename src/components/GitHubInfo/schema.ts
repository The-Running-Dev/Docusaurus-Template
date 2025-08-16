/**
 * GitHubInfo Component Schema
 *
 * Validation schema for GitHub configuration data
 */

import { z } from 'zod';

export const GitHubUrlsSchema = z.object({
  repository: z.string().url(),
  issues: z.string().url(),
  discussions: z.string().url(),
  docs: z.string().url(),
  pages: z.string().url(),
  packages: z.string().url(),
  api: z.string().url(),
  contributors: z.string().url(),
  releases: z.string().url(),
  pulls: z.string().url(),
  actions: z.string().url(),
  readme: z.string().url(),
  avatar: z.string().url()
});

export const GitHubMetadataSchema = z.object({
  defaultBranch: z.string(),
  license: z.string(),
  topics: z.array(z.string()),
  description: z.string()
});

export const GitHubFeaturesSchema = z.object({
  enableIssueLinks: z.boolean().optional().default(true),
  enableContributorLinks: z.boolean().optional().default(true),
  enableReleaseNotes: z.boolean().optional().default(true),
  showBranchInfo: z.boolean().optional().default(false)
});

export const GitHubIntegrationsSchema = z.object({
  githubActions: z
    .object({
      enabled: z.boolean().optional().default(true),
      workflows: z.array(z.string()).optional().default([])
    })
    .optional(),
  packages: z
    .object({
      enabled: z.boolean().optional().default(true),
      registries: z.array(z.string()).optional().default([])
    })
    .optional()
});

export const GitHubComponentConfigSchema = z.object({
  repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/, 'Must be in owner/repo format'),
  organization: z.string(),
  project: z.string(),
  urls: GitHubUrlsSchema,
  metadata: GitHubMetadataSchema,
  features: GitHubFeaturesSchema.optional(),
  integrations: GitHubIntegrationsSchema.optional()
});

// Export the schema with a consistent name for registration
export const componentSchema = GitHubComponentConfigSchema;
export const schemaKey = 'github';
