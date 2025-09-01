import { container } from './container.js';
import { SERVICE_TOKENS } from './tokens.js';
import { ConfigService } from '../../services/configService.js';
import { FileCacheService } from '../../services/cacheService.js';
import { JsonFileProjectRepository } from '../../repositories/jsonFileProjectRepository.js';

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

  // Register project repository as singleton
  // For now, we'll use the JSON file implementation
  // Later we can switch this based on configuration
  container.register(
    SERVICE_TOKENS.PROJECT_REPOSITORY,
    () => new JsonFileProjectRepository(),
    'singleton'
  );

  // Validate configuration after registration
  const configService = container.resolve<ConfigService>(SERVICE_TOKENS.CONFIG_SERVICE);
  configService.validateConfiguration();

  console.log('DI Container configured successfully');
  console.log('Registered services:', container.getRegisteredTokens());
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