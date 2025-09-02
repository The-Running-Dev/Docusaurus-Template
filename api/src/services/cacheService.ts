import fs from 'node:fs';
import path from 'node:path';
import { ICacheService, Category, IProjectRepository } from '../repositories/interfaces';
import { STORAGE_DIR } from '../lib/paths';
import { getService } from '../lib/di/index';
import { SERVICE_TOKENS } from '../lib/di/tokens';

const CACHE_DIR = path.join(STORAGE_DIR, 'cache');

/**
 * File-based cache service for JSON data
 * Provides write-through caching with automatic invalidation
 */
export class FileCacheService implements ICacheService {
  
  constructor() {
    this.ensureCacheDir();
  }

  private ensureCacheDir(): void {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  }

  private getCacheFilePath(key: string): string {
    return path.join(CACHE_DIR, `${key}.json`);
  }

  async getCachedData(key: string): Promise<string | null> {
    const filePath = this.getCacheFilePath(key);
    
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      }
    } catch (error) {
      console.warn(`Failed to read cache file ${key}:`, error);
    }
    
    return null;
  }

  async setCachedData(key: string, data: string): Promise<void> {
    const filePath = this.getCacheFilePath(key);
    
    try {
      // Atomic write using temporary file
      const tempPath = `${filePath}.tmp`;
      fs.writeFileSync(tempPath, data, 'utf8');
      fs.renameSync(tempPath, filePath);
    } catch (error) {
      console.error(`Failed to write cache file ${key}:`, error);
      throw error;
    }
  }

  async invalidateCache(key?: string): Promise<void> {
    try {
      if (key) {
        // Invalidate specific cache entry
        const filePath = this.getCacheFilePath(key);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } else {
        // Invalidate all cache entries
        if (fs.existsSync(CACHE_DIR)) {
          const files = fs.readdirSync(CACHE_DIR);
          for (const file of files) {
            if (file.endsWith('.json')) {
              fs.unlinkSync(path.join(CACHE_DIR, file));
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to invalidate cache ${key || 'all'}:`, error);
    }
  }

  async regenerateCache(): Promise<void> {
    try {
      // Get repository from DI container and regenerate cache
      const repo = getService<IProjectRepository>(
        SERVICE_TOKENS.PROJECT_REPOSITORY
      );
      const projects = await repo.getAll();

      await this.invalidateCache('projects');
      await this.setCachedProjects(projects);
    } catch (error) {
      console.warn('Failed to regenerate cache:', error);
    }
  }

  // Specific methods for projects cache
  async getCachedProjects(): Promise<Category[]> {
    const data = await this.getCachedData('projects');
    if (!data) {
      return [];
    }
    
    try {
      return JSON.parse(data) as Category[];
    } catch (error) {
      console.warn('Failed to parse cached projects data:', error);
      return [];
    }
  }

  async setCachedProjects(projects: Category[]): Promise<void> {
    const data = JSON.stringify(projects, null, 2);
    await this.setCachedData('projects', data);
  }

  // Cache statistics and management
  async getCacheStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    lastModified?: Date;
  }> {
    if (!fs.existsSync(CACHE_DIR)) {
      return { totalFiles: 0, totalSize: 0 };
    }

    const files = fs.readdirSync(CACHE_DIR);
    let totalSize = 0;
    let lastModified: Date | undefined;

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(CACHE_DIR, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        
        if (!lastModified || stats.mtime > lastModified) {
          lastModified = stats.mtime;
        }
      }
    }

    return {
      totalFiles: files.filter(f => f.endsWith('.json')).length,
      totalSize,
      lastModified
    };
  }

  async isCacheValid(key: string, maxAge: number = 3600000): Promise<boolean> {
    const filePath = this.getCacheFilePath(key);
    
    try {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const age = Date.now() - stats.mtime.getTime();
        return age < maxAge;
      }
    } catch (error) {
      console.warn(`Failed to check cache validity for ${key}:`, error);
    }
    
    return false;
  }

  async warmCache(): Promise<void> {
    // This will be implemented when integrated with repositories
    // For now, just ensure cache directory exists
    this.ensureCacheDir();
  }
}