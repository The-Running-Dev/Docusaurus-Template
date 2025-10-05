export type { Project, RepoStats } from '../../../shared/entities/project';
export type {
  Category,
  FlatProject
} from '../../../shared/types/project-types';
import { Project, RepoStats } from '../../../shared/entities/project';
import { Category, FlatProject } from '../../../shared/types/project-types';
import { User } from '../../../shared/entities/user';

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  validatePassword(user: User, password: string): Promise<boolean>;
}

export interface IRepoProvider {
  getRepoStats(url: string): Promise<RepoStats>;
}

export interface ISyncService {
  start(): void;
  syncAll(): Promise<void>;
  syncProject(id: number): Promise<void>;
}

/**
 * Repository interface for project data operations
 */
export interface IProjectRepository {
  // Read operations
  getAll(): Promise<Category[]>;
  getFlat(): Promise<FlatProject[]>;
  getById(
    category: string,
    subCategory: string,
    slug: string
  ): Promise<Project | null>;
  getByNumericId(id: number): Promise<FlatProject | null>;

  // Write operations
  save(
    category: string,
    subCategory: string,
    slug: string,
    project: Project
  ): Promise<Project>;
  delete(category: string, subCategory: string, slug: string): Promise<void>;

  // Batch operations
  saveMany(projects: FlatProject[]): Promise<void>;

  // Metadata operations
  exists(category: string, subCategory: string, slug: string): Promise<boolean>;
  count(): Promise<number>;
}

/**
 * Cache service interface for JSON generation
 */
export interface ICacheService {
  // Cache operations
  regenerateCache(): Promise<void>;
  getCachedData(key: string): Promise<string | null>;
  setCachedData(key: string, data: string): Promise<void>;
  invalidateCache(key?: string): Promise<void>;

  // Specific cache methods
  getCachedProjects(): Promise<Category[]>;
  setCachedProjects(projects: Category[]): Promise<void>;
}

/**
 * Configuration service interface
 */
export interface IConfigService {
  get<T>(key: string, defaultValue?: T): T;
  set(key: string, value: any): void;

  // Specific config getters
  getDatabaseUrl(): string;
  getDatabaseType(): 'postgres' | 'sqlite' | 'mysql';
  getProjectRepositoryType(): 'database';
  isSyncEnabled(): boolean;
  getSyncInterval(): 'daily' | 'weekly';
  getGitHubToken(): string | undefined;
  getAdminToken(): string | undefined;
  getPort(): number;
  getBasePath(): string;
  getCorsOrigin(): string;
  isCacheEnabled(): boolean;
  isDevelopment(): boolean;
  isProduction(): boolean;
}
