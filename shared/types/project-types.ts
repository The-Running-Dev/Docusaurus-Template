export type { Project } from '../entities/project';
// UI and API shared types
export interface ProjectCategory {
  category: string;
  subCategories: ProjectSubCategory[];
}

export interface ProjectSubCategory {
  name: string;
  projects: Project[];
}

export interface FilterOption {
  key: string;
  label: string;
  category?: string;
  count?: number;
}

export interface ProjectStats {
  totalProjects: number;
  recentProjects: number;
  totalTechnologies: number;
  averageAge: string;
}

export interface TagTiers {
  popular: FilterOption[];
  common: FilterOption[];
  rare: FilterOption[];
  allTagsOption: FilterOption;
}

export interface ProcessedSubCategory {
  name: string;
  projects: Project[];
}

export interface ProcessedCategory {
  category: string;
  subCategories: ProcessedSubCategory[];
}

export interface ProcessedProjectData {
  categories: ProcessedCategory[];
  technologyOptions: FilterOption[];
  categoryOptions: FilterOption[];
  dateOptions: FilterOption[];
  tagOptions: FilterOption[];
  tagTiers?: TagTiers;
  stats: ProjectStats;
  categoryText: string;
}

export interface ProjectTarget {
  category: string;
  subCategory: string;
  slug: string;
}

export interface SaveProjectInput extends ProjectTarget {
  project: Project;
}
import { Project } from '../entities/project';

export interface SubCategory {
  name: string;
  projects: Project[];
}

export interface Category {
  category: string;
  subCategories: SubCategory[];
}

export interface FlatProject {
  id?: string;
  category: string;
  subCategory: string;
  slug: string;
  project: Project;
}
