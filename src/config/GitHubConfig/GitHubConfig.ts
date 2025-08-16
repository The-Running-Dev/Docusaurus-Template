/**
 * GitHub Project Configuration System
 *
 * This module provides a clean, validated interface to GitHub configuration
 * loaded from YAML→JSON pipeline with comprehensive validation.
 */

export * from './configLoader';
export * from './models';
export * from './validation';

// Default export for backward compatibility
export { getGitHubConfig as default } from './configLoader';
