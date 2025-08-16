/**
 * GitHub Configuration Types
 *
 * TypeScript interfaces for the dynamic GitHub configuration loaded from YAML/JSON
 */
export interface GitHubConfig {
  /** Repository in owner/repo format */
  repo: string;

  /** GitHub organization/user */
  organization: string;

  /** Repository name */
  project: string;

  /** All GitHub URLs */
  urls: GitHubUrls;

  /** Project metadata */
  metadata: GitHubMetadata;

  /** Optional feature flags */
  features?: GitHubFeatures;

  /** Optional integration settings */
  integrations?: GitHubIntegrations;
}

export interface GitHubUrls {
  repository: string;
  issues: string;
  discussions: string;
  docs: string;
  pages: string;
  packages: string;
  api: string;
  contributors: string;
  releases: string;
  pulls: string;
  actions: string;
  readme: string;
  avatar: string;
}

export interface GitHubMetadata {
  defaultBranch: string;
  license: string;
  topics: readonly string[];
  description: string;
}

export interface GitHubFeatures {
  enableIssueLinks?: boolean;
  enableContributorLinks?: boolean;
  enableReleaseNotes?: boolean;
  showBranchInfo?: boolean;
}

export interface GitHubIntegrations {
  githubActions?: {
    enabled?: boolean;
    workflows?: string[];
  };
  packages?: {
    enabled?: boolean;
    registries?: string[];
  };
}

export interface GitHubInfoProps {
  className?: string;
}
