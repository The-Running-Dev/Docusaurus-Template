/**
 * Service tokens for dependency injection
 * These constants ensure type safety and prevent typos
 */

export const SERVICE_TOKENS = {
  // Repository tokens
  PROJECT_REPOSITORY: 'IProjectRepository',
  
  // Service tokens
  CACHE_SERVICE: 'ICacheService',
  SYNC_SERVICE: 'ISyncService',
  
  // Provider tokens
  GITHUB_PROVIDER: 'IGitHubProvider',
  GITLAB_PROVIDER: 'IGitLabProvider',
  
  // Infrastructure tokens
  DATABASE_CONNECTION: 'DatabaseConnection',
  CONFIG_SERVICE: 'IConfigService'
} as const;

export type ServiceToken = typeof SERVICE_TOKENS[keyof typeof SERVICE_TOKENS];