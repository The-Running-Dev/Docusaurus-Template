import { container } from './container.js';
import { SERVICE_TOKENS } from './tokens.js';
import { ConfigService } from '../../services/configService.js';
import { FileCacheService } from '../../services/cacheService.js';
import { JsonProjectRepository } from '../../repositories/json-project-repository.js';
import { GitHubRepoProvider } from '../../services/githubProvider.js';
import { SyncService } from '../../services/syncService.js';

/**
 * Configure and register all services in the DI container
 * This is called during application startup
 */
export function configureContainer(): void {
  // Register configuration service as singleton
  container.register(
    SERVICE_TOKENS.CONFIG_SERVICE,
    () => new ConfigService(),
    'singleton'
  );

  // Register cache service as singleton
  container.register(
    SERVICE_TOKENS.CACHE_SERVICE,
    () => new FileCacheService(),
    'singleton'
  );

  const configService = container.resolve<ConfigService>(
    SERVICE_TOKENS.CONFIG_SERVICE
  );

  // Register project repository - use JSON repository
  container.register(
    SERVICE_TOKENS.PROJECT_REPOSITORY,
    () => new JsonProjectRepository(),
    'singleton'
  );

  // Register GitHub provider
  container.register(
    SERVICE_TOKENS.GITHUB_PROVIDER,
    () => new GitHubRepoProvider(configService),
    'singleton'
  );

  // Register sync service
  container.register(
    SERVICE_TOKENS.SYNC_SERVICE,
    () =>
      new SyncService(
        container.resolve(SERVICE_TOKENS.PROJECT_REPOSITORY),
        container.resolve(SERVICE_TOKENS.GITHUB_PROVIDER),
        container.resolve(SERVICE_TOKENS.CACHE_SERVICE),
        configService
      ),
    'singleton'
  );

  // Validate configuration after registration
  configService.validateConfiguration();

  if (configService.isSyncEnabled()) {
    const sync = container.resolve<SyncService>(SERVICE_TOKENS.SYNC_SERVICE);
    sync.start();
  }
}

/**
 * Get a service from the container with type safety
 * This is a convenience wrapper around container.resolve()
 */
export function getService<T>(token: string): T {
  return container.resolve<T>(token);
}

/**
 * Check if container is properly configured
 */
export function isContainerReady(): boolean {
  return container.isRegistered(SERVICE_TOKENS.CONFIG_SERVICE);
}

/**
 * Reset container (useful for testing)
 */
export function resetContainer(): void {
  container.clear();
}
