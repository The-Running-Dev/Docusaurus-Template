/**
 * Integration Tests for GitHub Configuration System
 *
 * Tests for configuration loading, validation, and utility functions.
 * Uses the unified configuration loader to ensure consistency.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getGitHubConfig,
  getRepositoryInfo,
  getGitHubUrls,
  getProjectMetadata,
  resetGitHubConfigCache,
  isGitHubConfigCached
} from '../configLoader';

// Import legacy functions for backward compatibility testing
import { getGitHubUrl, getRepositoryUrl, getApiUrl } from '../GitHubConfig';

// For type annotations, we need to get the return type
type GitHubConfig = ReturnType<typeof getGitHubConfig>;
import {
  validateGitHubConfig,
  validateGitHubUrls,
  isValidRepoFormat,
  parseRepoString,
  generateGitHubUrls,
  createGitHubConfigTemplate,
  assertValidGitHubConfig
} from '../validation';

describe('GitHub Configuration System', () => {
  let config: GitHubConfig;

  beforeEach(() => {
    // Reset cache before each test to ensure fresh data
    resetGitHubConfigCache();
    config = getGitHubConfig();
  });

  afterEach(() => {
    // Clean up cache after each test
    resetGitHubConfigCache();
  });

  describe('Configuration Loading', () => {
    it('should load complete GitHub configuration', () => {
      expect(config).toBeDefined();
      expect(config.repo).toBe('The-Running-Dev/Portfolio');
      expect(config.organization).toBe('The-Running-Dev');
      expect(config.project).toBe('Portfolio');
    });

    it('should provide repository information', () => {
      const repoInfo = getRepositoryInfo();
      expect(repoInfo.repo).toBe('The-Running-Dev/Portfolio');
      expect(repoInfo.organization).toBe('The-Running-Dev');
      expect(repoInfo.project).toBe('Portfolio');
    });

    it('should provide GitHub URLs', () => {
      const urls = getGitHubUrls();
      expect(urls.repository).toBe(
        'https://github.com/The-Running-Dev/Portfolio'
      );
      expect(urls.issues).toBe(
        'https://github.com/The-Running-Dev/Portfolio/issues'
      );
      expect(urls.api).toBe(
        'https://api.github.com/repos/The-Running-Dev/Portfolio'
      );
    });

    it('should provide project metadata', () => {
      const metadata = getProjectMetadata();
      expect(metadata.defaultBranch).toBe('main');
      expect(metadata.license).toBe('MIT');
      expect(metadata.topics).toContain('docusaurus');
      expect(metadata.description).toContain('Docusaurus');
    });

    it('should cache configuration after first load', () => {
      // Reset cache and verify it's not cached
      resetGitHubConfigCache();
      expect(isGitHubConfigCached()).toBe(false);

      // Load configuration and verify caching
      const config1 = getGitHubConfig();
      expect(isGitHubConfigCached()).toBe(true);

      // Subsequent calls should return the same cached object
      const config2 = getGitHubConfig();
      expect(config1).toBe(config2); // Same reference due to caching
    });
  });

  describe('URL Utilities', () => {
    it('should get specific URLs by key', () => {
      expect(getGitHubUrl('repository')).toBe(
        'https://github.com/The-Running-Dev/Portfolio'
      );
      expect(getGitHubUrl('issues')).toBe(
        'https://github.com/The-Running-Dev/Portfolio/issues'
      );
      expect(getGitHubUrl('api')).toBe(
        'https://api.github.com/repos/The-Running-Dev/Portfolio'
      );
    });

    it('should build repository URLs with optional paths', () => {
      expect(getRepositoryUrl()).toBe(
        'https://github.com/The-Running-Dev/Portfolio'
      );
      expect(getRepositoryUrl('/blob/main/README.md')).toBe(
        'https://github.com/The-Running-Dev/Portfolio/blob/main/README.md'
      );
      expect(getRepositoryUrl('issues')).toBe(
        'https://github.com/The-Running-Dev/Portfolio/issues'
      );
    });

    it('should build API URLs with optional endpoints', () => {
      expect(getApiUrl()).toBe(
        'https://api.github.com/repos/The-Running-Dev/Portfolio'
      );
      expect(getApiUrl('/releases')).toBe(
        'https://api.github.com/repos/The-Running-Dev/Portfolio/releases'
      );
      expect(getApiUrl('contributors')).toBe(
        'https://api.github.com/repos/The-Running-Dev/Portfolio/contributors'
      );
    });
  });

  describe('Configuration Validation', () => {
    it('should validate correct configuration', () => {
      const result = validateGitHubConfig(config);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.repo).toBe('The-Running-Dev/Portfolio');
      }
    });

    it('should reject invalid configuration', () => {
      const invalidConfig = {
        repo: 'invalid-repo-format',
        organization: '',
        project: 'TestProject',
        urls: {},
        metadata: {}
      };

      const result = validateGitHubConfig(invalidConfig);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect((result as { success: false; error: string }).error).toContain(
          'validation failed'
        );
      }
    });

    it('should validate GitHub URLs format', async () => {
      const validation = await validateGitHubUrls(config);
      expect(validation.valid.length).toBeGreaterThan(0);
      expect(validation.invalid.length).toBe(0);
    });

    it('should assert valid configuration', () => {
      expect(() => assertValidGitHubConfig(config)).not.toThrow();
    });

    it('should throw on invalid configuration assertion', () => {
      const invalidConfig = { repo: 'invalid' };
      expect(() => assertValidGitHubConfig(invalidConfig)).toThrow();
    });
  });

  describe('Repository Format Validation', () => {
    it('should validate correct repo formats', () => {
      expect(isValidRepoFormat('owner/repo')).toBe(true);
      expect(isValidRepoFormat('The-Running-Dev/Portfolio')).toBe(true);
      expect(isValidRepoFormat('user123/project-name')).toBe(true);
    });

    it('should reject invalid repo formats', () => {
      expect(isValidRepoFormat('invalid')).toBe(false);
      expect(isValidRepoFormat('owner/')).toBe(false);
      expect(isValidRepoFormat('/repo')).toBe(false);
      expect(isValidRepoFormat('')).toBe(false);
    });

    it('should parse repository strings', () => {
      const parsed = parseRepoString('The-Running-Dev/Portfolio');
      expect(parsed).toEqual({
        organization: 'The-Running-Dev',
        project: 'Portfolio'
      });

      const invalid = parseRepoString('invalid-format');
      expect(invalid).toBeNull();
    });
  });

  describe('URL Generation', () => {
    it('should generate GitHub URLs from repository', () => {
      const urls = generateGitHubUrls('test-user/test-repo');
      expect(urls.repository).toBe('https://github.com/test-user/test-repo');
      expect(urls.issues).toBe('https://github.com/test-user/test-repo/issues');
      expect(urls.api).toBe('https://api.github.com/repos/test-user/test-repo');
      expect(urls.avatar).toBe('https://github.com/test-user.png');
    });

    it('should generate URLs with custom options', () => {
      const urls = generateGitHubUrls('test-user/test-repo', {
        pagesUrl: 'https://custom-pages.com',
        defaultBranch: 'develop',
        packagesPath: '/custom-packages'
      });

      expect(urls.pages).toBe('https://custom-pages.com');
      expect(urls.readme).toBe(
        'https://github.com/test-user/test-repo/blob/develop/README.md'
      );
      expect(urls.packages).toBe(
        'https://github.com/test-user/test-repo/custom-packages'
      );
    });
  });

  describe('Configuration Template Creation', () => {
    it('should create configuration template with defaults', () => {
      const template = createGitHubConfigTemplate('test-org/test-project');

      expect(template.repo).toBe('test-org/test-project');
      expect(template.organization).toBe('test-org');
      expect(template.project).toBe('test-project');
      expect(template.metadata.license).toBe('MIT');
      expect(template.metadata.defaultBranch).toBe('main');
      expect(template.metadata.topics).toContain('typescript');
    });

    it('should create configuration template with custom options', () => {
      const template = createGitHubConfigTemplate('test-org/test-project', {
        license: 'Apache-2.0',
        description: 'Custom project description',
        topics: ['react', 'nextjs'],
        pagesUrl: 'https://custom.domain.com',
        defaultBranch: 'develop'
      });

      expect(template.metadata.license).toBe('Apache-2.0');
      expect(template.metadata.description).toBe('Custom project description');
      expect(template.metadata.topics).toEqual(['react', 'nextjs']);
      expect(template.urls.pages).toBe('https://custom.domain.com');
      expect(template.metadata.defaultBranch).toBe('develop');
    });

    it('should throw for invalid repository format', () => {
      expect(() => createGitHubConfigTemplate('invalid')).toThrow(
        'Invalid repository format'
      );
    });
  });

  describe('Configuration Immutability', () => {
    it('should provide immutable configuration', () => {
      const config = getGitHubConfig();

      // Test that configuration objects are frozen
      expect(Object.isFrozen(config)).toBe(true);
      expect(Object.isFrozen(config.urls)).toBe(true);
      expect(Object.isFrozen(config.metadata)).toBe(true);
      expect(Object.isFrozen(config.metadata.topics)).toBe(true);
    });
  });
});
