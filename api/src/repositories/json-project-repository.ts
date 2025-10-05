import {
  IProjectRepository,
  Category,
  FlatProject,
  Project
} from './interfaces';
import { getFlatFromStorage, combineToNested } from '../lib/projectsStore';
import path from 'path';
import fs from 'fs';
import { STORAGE_DIR } from '../lib/paths';

/**
 * JSON file-based implementation of the project repository
 */
export class JsonProjectRepository implements IProjectRepository {
  private readonly storageDir: string;

  constructor() {
    this.storageDir = path.join(STORAGE_DIR, 'projects');
    this.ensureStorageDir();
  }

  private ensureStorageDir(): void {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  private getProjectPath(
    category: string,
    subCategory: string,
    slug: string
  ): string {
    return path.join(this.storageDir, category, subCategory, `${slug}.json`);
  }

  private readJsonFile<T>(filePath: string): T | null {
    try {
      if (!fs.existsSync(filePath)) return null;
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content) as T;
    } catch (error) {
      console.error(`Error reading JSON file ${filePath}:`, error);
      return null;
    }
  }

  private writeJsonFile(filePath: string, data: any): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, json, 'utf8');
  }

  async getFlat(): Promise<FlatProject[]> {
    try {
      return getFlatFromStorage();
    } catch (error) {
      console.error('Error getting flat projects:', error);
      return [];
    }
  }

  async getAll(): Promise<Category[]> {
    try {
      const flat = await this.getFlat();
      return combineToNested(flat);
    } catch (error) {
      console.error('Error getting all projects:', error);
      return [];
    }
  }

  async getById(
    category: string,
    subCategory: string,
    slug: string
  ): Promise<Project | null> {
    try {
      const filePath = this.getProjectPath(category, subCategory, slug);
      return this.readJsonFile<Project>(filePath);
    } catch (error) {
      console.error(
        `Error getting project ${category}/${subCategory}/${slug}:`,
        error
      );
      return null;
    }
  }

  async getByNumericId(id: number): Promise<FlatProject | null> {
    try {
      const flat = await this.getFlat();
      const project = flat.find((p) => p.id === id.toString());
      return project || null;
    } catch (error) {
      console.error(`Error getting project by ID ${id}:`, error);
      return null;
    }
  }

  async save(
    category: string,
    subCategory: string,
    slug: string,
    project: Project
  ): Promise<Project> {
    try {
      const filePath = this.getProjectPath(category, subCategory, slug);
      this.writeJsonFile(filePath, project);
      return project;
    } catch (error) {
      console.error(
        `Error saving project ${category}/${subCategory}/${slug}:`,
        error
      );
      throw error;
    }
  }

  async delete(
    category: string,
    subCategory: string,
    slug: string
  ): Promise<void> {
    try {
      const filePath = this.getProjectPath(category, subCategory, slug);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(
        `Error deleting project ${category}/${subCategory}/${slug}:`,
        error
      );
      throw error;
    }
  }

  async saveMany(projects: FlatProject[]): Promise<void> {
    for (const p of projects) {
      await this.save(p.category, p.subCategory, p.slug, p.project);
    }
  }

  async exists(
    category: string,
    subCategory: string,
    slug: string
  ): Promise<boolean> {
    try {
      const filePath = this.getProjectPath(category, subCategory, slug);
      return fs.existsSync(filePath);
    } catch (error) {
      console.error(
        `Error checking if project exists ${category}/${subCategory}/${slug}:`,
        error
      );
      return false;
    }
  }

  async count(): Promise<number> {
    try {
      const flat = await this.getFlat();
      return flat.length;
    } catch (error) {
      console.error('Error counting projects:', error);
      return 0;
    }
  }
}
