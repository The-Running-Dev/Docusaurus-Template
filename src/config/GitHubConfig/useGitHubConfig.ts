import { useMemo } from 'react';
import { getGitHubConfig } from './configLoader';
import type { GitHubConfig } from './models';

/**
 * React hook for accessing GitHub configuration
 *
 * Uses the unified configuration loader to ensure consistency
 * between app and test environments.
 *
 * @returns {GitHubConfig} Validated GitHub configuration
 */
export function useGitHubConfig(): GitHubConfig {
  return useMemo(() => {
    try {
      // Use the unified configuration loader
      return getGitHubConfig();
    } catch (error) {
      console.error('[ERROR] Failed to load GitHub configuration:', error);

      // Re-throw the error so components can handle it appropriately
      throw error;
    }
  }, []); // Empty dependency array since config is cached internally
}
