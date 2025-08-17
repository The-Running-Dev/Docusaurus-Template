import { useMemo } from 'react';
import { getData } from '../../../data';
import { GlobalConfig, PortfolioConfig } from '../../../entities';
import { DEFAULT_PORTFOLIO_CONFIG } from '../constants';

// @ts-ignore
import { globalConfig as configData } from '../../../../data';

/**
 * Hook to access projects configuration from global config
 * Provides sensible defaults if configuration is missing
 */
export function useConfig(): PortfolioConfig {
  return useMemo(() => {
    try {
      const globalConfig = getData<GlobalConfig>(configData);

      // Use configuration values or fall back to defaults
      const provider =
        globalConfig.portfolio?.provider || DEFAULT_PORTFOLIO_CONFIG.provider;
      const location =
        globalConfig.portfolio?.location || DEFAULT_PORTFOLIO_CONFIG.location;

      return {
        provider,
        location
      };
    } catch (error) {
      console.error('Failed to Load Portfolio Configuration:', error);

      // Return safe defaults
      return DEFAULT_PORTFOLIO_CONFIG;
    }
  }, []);
}

export default useConfig;
