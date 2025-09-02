import {
  IProjectRepository,
  Project,
  Category,
  FlatProject
} from './interfaces';

// Import existing functions from projectsStore
import {
  getProjectsCombined,
  getFlatFromStorage,
  getProject,
  saveProject,
  deleteProject as deleteProjectFromStorage,
  ProjectSchema
} from '../lib/projectsStore';

/**
 * JSON File-based implementation of the project repository
 * Wraps existing projectsStore functionality with the repository interface
 */
export class JsonFileProjectRepository implements IProjectRepository {
  
  async getAll(): Promise<Category[]> {
    // Use existing function that combines JSON files into nested structure
    return getProjectsCombined();
  }

  async getFlat(): Promise<FlatProject[]> {
    // Use existing function that returns flat list with metadata
    return getFlatFromStorage();
  }

  async getById(category: string, subCategory: string, slug: string): Promise<Project | null> {
    // Use existing function to get specific project
    return getProject(category, subCategory, slug);
  }

  async getByNumericId(id: number): Promise<FlatProject | null> {
    // JSON storage doesn't support numeric IDs
    return null;
  }

  async save(category: string, subCategory: string, slug: string, project: Project): Promise<Project> {
    // Validate project data using existing schema
    const validatedProject = ProjectSchema.parse(project);
    
    // Use existing function to save project with atomic file operations
    return saveProject(category, subCategory, slug, validatedProject);
  }

  async delete(category: string, subCategory: string, slug: string): Promise<void> {
    // Use existing function to delete project file
    deleteProjectFromStorage(category, subCategory, slug);
  }

  async saveMany(projects: FlatProject[]): Promise<void> {
    // Batch save operation - save each project individually
    // Note: This could be optimized in the future with bulk operations
    for (const { category, subCategory, slug, project } of projects) {
      await this.save(category, subCategory, slug, project);
    }
  }

  async exists(category: string, subCategory: string, slug: string): Promise<boolean> {
    // Check if project exists by trying to get it
    const project = await this.getById(category, subCategory, slug);
    return project !== null;
  }

  async count(): Promise<number> {
    // Count total number of projects by getting flat list
    const projects = await this.getFlat();
    return projects.length;
  }

  // Additional utility methods specific to file-based storage
  
  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalProjects: number;
    categories: number;
    subCategories: number;
    lastModified?: Date;
  }> {
    const flat = await this.getFlat();
    const categories = new Set(flat.map(p => p.category));
    const subCategories = new Set(flat.map(p => `${p.category}/${p.subCategory}`));
    
    // Find most recent modification
    let lastModified: Date | undefined;
    for (const { project } of flat) {
      if (project.lastModified) {
        const date = typeof project.lastModified === 'string' 
          ? new Date(project.lastModified)
          : project.lastModified;
        
        if (!lastModified || date > lastModified) {
          lastModified = date;
        }
      }
    }

    return {
      totalProjects: flat.length,
      categories: categories.size,
      subCategories: subCategories.size,
      lastModified
    };
  }

  /**
   * Get projects by category
   */
  async getByCategory(category: string): Promise<FlatProject[]> {
    const flat = await this.getFlat();
    return flat.filter(p => p.category === category);
  }

  /**
   * Get projects by subcategory
   */
  async getBySubCategory(category: string, subCategory: string): Promise<FlatProject[]> {
    const flat = await this.getFlat();
    return flat.filter(p => p.category === category && p.subCategory === subCategory);
  }

  /**
   * Search projects by title or tags
   */
  async search(query: string): Promise<FlatProject[]> {
    const flat = await this.getFlat();
    const searchTerm = query.toLowerCase();
    
    return flat.filter(({ project }) => 
      project.title.toLowerCase().includes(searchTerm) ||
      project.summary.toLowerCase().includes(searchTerm) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get projects by tag
   */
  async getByTag(tag: string): Promise<FlatProject[]> {
    const flat = await this.getFlat();
    return flat.filter(({ project }) => 
      project.tags.includes(tag)
    );
  }

  /**
   * Get all unique tags
   */
  async getAllTags(): Promise<string[]> {
    const flat = await this.getFlat();
    const tags = new Set<string>();
    
    flat.forEach(({ project }) => {
      project.tags.forEach(tag => tags.add(tag));
    });
    
    return Array.from(tags).sort();
  }
}