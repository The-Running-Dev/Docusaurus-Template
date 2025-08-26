import { useMemo } from 'react';
import { useProcessor } from './useProcessor';
import { DEFAULT_PROJECTS_DATA } from '../constants';

/**
 * Query methods for projects data
 */
export interface ProjectsQuery {
  hasProjectsWithTag: (tag: string) => boolean;

  getProjectsByTag: (tag: string) => any[];

  hasProjectsWithTechnology: (tech: string) => boolean;

  hasProjectsWithCategory: (category: string) => boolean;

  getAllTags: () => string[];

  getAllTechnologies: () => string[];

  getAllCategories: () => string[];
}

/**
 * useProjects hook result
 */
export interface UseProjectsResult extends ProjectsQuery {
  projects: any[];

  loading: boolean;

  error: Error | null;
}

/**
 * Hook for accessing and querying projects data
 * Provides cached access to processed projects data with utility methods
 */
export function useProjects(): UseProjectsResult {
  // Use static data - reliable and always works
  const rawProjectsData = DEFAULT_PROJECTS_DATA;

  // Get processed projects data (with all filters disabled to get full dataset)
  const { processedData, loading, error } = useProcessor(rawProjectsData, {
    selectedCategory: 'all',
    selectedDateRange: 'all-dates',
    searchTerm: ''
  });

  // Flatten all projects from categories and subcategories
  const allProjects = useMemo(() => {
    if (!processedData) return [];

    return processedData.categories.flatMap((category) =>
      category.subCategories.flatMap((subCategory) => subCategory.projects)
    );
  }, [processedData]);

  // Extract all unique tags from projects
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();

    allProjects.forEach((project) => {
      project.tags?.forEach((tag: string) => {
        tagSet.add(tag.toLowerCase());
      });
    });

    return Array.from(tagSet);
  }, [allProjects]);

  // Extract all unique technologies (subcategories)
  const allTechnologies = useMemo(() => {
    if (!processedData) return [];

    const techSet = new Set<string>();

    processedData.categories.forEach((category) => {
      category.subCategories.forEach((subCategory) => {
        techSet.add(subCategory.name.toLowerCase());
      });
    });

    return Array.from(techSet);
  }, [processedData]);

  // Extract all unique categories
  const allCategories = useMemo(() => {
    if (!processedData) return [];

    return processedData.categories.map((category) =>
      category.category.toLowerCase()
    );
  }, [processedData]);

  // Query methods
  const query: ProjectsQuery = useMemo(
    () => ({
      hasProjectsWithTag: (tag: string) => {
        const normalizedTag = tag.toLowerCase();

        return allProjects.some((project) =>
          project.tags?.some(
            (projectTag: string) => projectTag.toLowerCase() === normalizedTag
          )
        );
      },

      getProjectsByTag: (tag: string) => {
        const normalizedTag = tag.toLowerCase();

        return allProjects.filter((project) =>
          project.tags?.some(
            (projectTag: string) => projectTag.toLowerCase() === normalizedTag
          )
        );
      },

      hasProjectsWithTechnology: (tech: string) => {
        const normalizedTech = tech.toLowerCase();

        return allTechnologies.includes(normalizedTech);
      },

      hasProjectsWithCategory: (category: string) => {
        const normalizedCategory = category.toLowerCase();

        return allCategories.includes(normalizedCategory);
      },

      getAllTags: () => allTags,
      getAllTechnologies: () => allTechnologies,
      getAllCategories: () => allCategories
    }),
    [allProjects, allTags, allTechnologies, allCategories]
  );

  return {
    projects: allProjects,
    loading,
    error,
    ...query
  };
}
