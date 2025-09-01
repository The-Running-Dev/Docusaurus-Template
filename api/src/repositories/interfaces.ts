import { z } from 'zod';

// Re-export existing schema and types from projectsStore
export const ProjectSchema = z.object({
  title: z.string().min(1),
  link: z.string().url().or(z.string().min(1)).optional(),
  lastModified: z.union([z.string(), z.date()]).optional(),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([])
});

export type Project = z.infer<typeof ProjectSchema>;

export interface SubCategory {
  name: string;
  projects: Project[];
}

export interface Category {
  category: string;
  subCategories: SubCategory[];
}

export interface FlatProject {
  category: string;
  subCategory: string;
  slug: string;
  project: Project;
}

// Enhanced project with sync metadata
export interface ProjectWithMetadata extends Project {
  // Repository information
  repoUrl?: string;
  
  // Auto-sync statistics
  stats?: {
    stars: number;
    forks: number;
    language: string;
    size: number;
    lastCommit: Date;
    openIssues: number;
  };
  
  // Sync metadata
  lastSyncedAt?: Date;
  syncEnabled: boolean;
  syncInterval: 'daily' | 'weekly' | 'disabled';
}

/**
 * Repository interface for project data operations
 */
export interface IProjectRepository {
  // Read operations
  getAll(): Promise<Category[]>;
  getFlat(): Promise<FlatProject[]>;
  getById(category: string, subCategory: string, slug: string): Promise<Project | null>;
  
  // Write operations
  save(category: string, subCategory: string, slug: string, project: Project): Promise<Project>;
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
  isSyncEnabled(): boolean;
  getGitHubToken(): string | undefined;
  getAdminToken(): string | undefined;
  getPort(): number;
  getBasePath(): string;
  getCorsOrigin(): string;
  isCacheEnabled(): boolean;
  isDevelopment(): boolean;
  isProduction(): boolean;
}