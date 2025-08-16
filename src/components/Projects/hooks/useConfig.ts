import { useMemo } from 'react';
import { getData } from '../../../data';
import { GlobalConfig, ProjectsConfig } from '../../../entities';
import { DEFAULT_PROJECTS_CONFIG } from '../constants';

// @ts-ignore
import { globalConfig as configData } from '../../../../data';

/**
 * Hook to access projects configuration from global config
 * Provides sensible defaults if configuration is missing
 */
export function useConfig(): ProjectsConfig {
  return useMemo(() => {
    try {
      const globalConfig = getData<GlobalConfig>(configData);

      // Use configuration values or fall back to defaults
      const provider =
        globalConfig.projects?.provider || DEFAULT_PROJECTS_CONFIG.provider;
      const location =
        globalConfig.projects?.location || DEFAULT_PROJECTS_CONFIG.location;

      return {
        provider,
        location
      };
    } catch (error) {
      console.error('Failed to Load Projects Configuration:', error);

      // Return safe defaults
      return DEFAULT_PROJECTS_CONFIG;
    }
  }, []);
}

export default useConfig;
