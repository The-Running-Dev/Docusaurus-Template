import { IConfigService } from '../repositories/interfaces';

/**
 * Configuration service that manages environment variables and app settings
 */
export class ConfigService implements IConfigService {
  private config: Map<string, any> = new Map();

  constructor() {
    this.loadEnvironmentVariables();
  }

  private loadEnvironmentVariables(): void {
    // Database configuration
    this.set('DATABASE_URL', process.env.DATABASE_URL || 'sqlite::memory:');
    this.set('DATABASE_TYPE', process.env.DATABASE_TYPE || 'sqlite');
    this.set('PROJECT_REPOSITORY', process.env.PROJECT_REPOSITORY || 'json');

    // API configuration
    this.set('PORT', Number(process.env.PORT || 4000));
    this.set('BASE_PATH', process.env.BASE_PATH || '/api');
    this.set('CORS_ORIGIN', process.env.CORS_ORIGIN || '*');

    // Authentication
    this.set('ADMIN_TOKEN', process.env.ADMIN_TOKEN);

    // Repository configuration
    this.set('PROJECT_REPOSITORY', process.env.PROJECT_REPOSITORY || 'json');

    // Sync configuration
    this.set('SYNC_ENABLED', process.env.SYNC_ENABLED === 'true');
    this.set('SYNC_INTERVAL', process.env.SYNC_INTERVAL || 'daily');
    this.set('SYNC_CRON', process.env.SYNC_CRON || '0 2 * * *'); // Daily at 2 AM

    // External API tokens
    this.set('GITHUB_TOKEN', process.env.GITHUB_TOKEN);
    this.set('GITLAB_TOKEN', process.env.GITLAB_TOKEN);

    // Cache configuration
    this.set('CACHE_ENABLED', process.env.CACHE_ENABLED !== 'false'); // default true
    this.set('CACHE_TTL', Number(process.env.CACHE_TTL || 3600)); // 1 hour

    // Environment
    this.set('NODE_ENV', process.env.NODE_ENV || 'development');
  }

  get<T>(key: string, defaultValue?: T): T {
    const value = this.config.get(key);
    return value !== undefined ? value : defaultValue;
  }

  set(key: string, value: any): void {
    this.config.set(key, value);
  }

  // Specific configuration getters with proper types
  getDatabaseUrl(): string {
    return this.get<string>('DATABASE_URL', 'sqlite::memory:');
  }

  getDatabaseType(): 'postgres' | 'sqlite' | 'mysql' {
    const type = this.get<string>('DATABASE_TYPE', 'sqlite').toLowerCase();
    if (['postgres', 'sqlite', 'mysql'].includes(type)) {
      return type as 'postgres' | 'sqlite' | 'mysql';
    }
    return 'sqlite';
  }

  getProjectRepositoryType(): 'database' {
    // Always use database repository
    return 'database';
  }

  isSyncEnabled(): boolean {
    return this.get<boolean>('SYNC_ENABLED', false);
  }

  getGitHubToken(): string | undefined {
    return this.get<string>('GITHUB_TOKEN');
  }

  getGitLabToken(): string | undefined {
    return this.get<string>('GITLAB_TOKEN');
  }

  getAdminToken(): string | undefined {
    return this.get<string>('ADMIN_TOKEN');
  }

  getPort(): number {
    return this.get<number>('PORT', 4000);
  }

  getBasePath(): string {
    return this.get<string>('BASE_PATH', '/api');
  }

  getCorsOrigin(): string {
    return this.get<string>('CORS_ORIGIN', '*');
  }

  isCacheEnabled(): boolean {
    return this.get<boolean>('CACHE_ENABLED', true);
  }

  getSyncInterval(): 'daily' | 'weekly' {
    return this.get<'daily' | 'weekly'>('SYNC_INTERVAL', 'daily');
  }

  getSyncCron(): string {
    return this.get<string>('SYNC_CRON', '0 2 * * *');
  }

  getCacheTTL(): number {
    return this.get<number>('CACHE_TTL', 3600);
  }

  isDevelopment(): boolean {
    return this.get<string>('NODE_ENV', 'development') === 'development';
  }

  isProduction(): boolean {
    return this.get<string>('NODE_ENV', 'development') === 'production';
  }

  // Validation methods
  validateConfiguration(): void {
    const requiredInProduction = ['ADMIN_TOKEN'];

    if (this.isProduction()) {
      for (const key of requiredInProduction) {
        if (!this.get(key)) {
          throw new Error(`Missing required configuration: ${key}`);
        }
      }
    }

    // Validate database URL format
    const dbUrl = this.getDatabaseUrl();
    if (!dbUrl || dbUrl === 'sqlite::memory:') {
      console.warn('Using in-memory SQLite database - data will not persist');
    }
  }

  // Debug helper
  getAll(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of this.config) {
      // Don't expose sensitive values in debug output
      if (key.includes('TOKEN') || key.includes('PASSWORD')) {
        result[key] = value ? '[HIDDEN]' : undefined;
      } else {
        result[key] = value;
      }
    }
    return result;
  }
}
