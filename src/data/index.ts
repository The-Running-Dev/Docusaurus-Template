/**
 * Centralized data exports
 * All data access should go through this file for consistency
 */

// Re-export everything from the data loader
export * from './dataLoader';

// Re-export cache management utilities
export * from './cacheManager';

// Re-export types for convenience
export type { CVData } from '../components/CV/models';
export type { PortfolioData } from '../components/Portfolio/models';
export type { Theme } from '../components/ThemeSwitcher/models';
export type { NavBarLink } from '../entities/navBarLink';
export type { FeaturesConfig } from '../config/FeaturesConfig/models';
