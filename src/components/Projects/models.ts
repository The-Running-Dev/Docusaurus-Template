/**
 * Models for Projects component
 */

import React from 'react';

export interface ProjectConfig {
  categories: ProjectCategory[];
}

export interface ProjectCategory {
  category: string;

  subCategories: ProjectSubCategory[];
}

export interface ProjectSubCategory {
  name: string;

  projects: Project[];
}

export interface Project {
  title: string;

  summary: string;

  lastModified?: string;

  link?: string;

  tags?: string[];
}

export interface ProcessedSubCategory {
  name: string;

  projects: Project[];
}

export interface ProcessedCategory {
  category: string;

  subCategories: ProcessedSubCategory[];
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
  popular: FilterOption[]; // 3+ count

  common: FilterOption[]; // 2 count

  rare: FilterOption[]; // 1 count

  allTagsOption: FilterOption; // "All Tags" option
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

export interface ProjectsProps {
  selectedCategory?: string;

  selectedDateRange?: string;

  searchTerm?: string;
}

export interface ProjectsData {
  processedData: ProcessedProjectData;

  loading: boolean;
}

export interface FilterButtonProps {
  option: FilterOption;
  isSelected: boolean;
  isDisabled: boolean;
  isLoading?: boolean;
  hasSearchResults?: boolean;
  searchResultCount?: number;
  totalCount?: number;
  onClick: (key: string) => void;
  searchTerm?: string;
}

export interface SearchBoxProps {
  searchTerm: string;

  setSearchTerm: (term: string) => void;

  searchInputRef: React.RefObject<HTMLInputElement>;

  handleClearSearch: () => void;
}

export interface ProjectHeaderProps {
  categoryText: string;
}

export interface ProjectStatsProps {
  stats: {
    totalProjects: number;
    recentProjects: number;
    totalTechnologies: number;
    averageAge: string;
  };
}
