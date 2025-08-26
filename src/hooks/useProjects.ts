import { useCallback } from 'react';
import { useDataStore } from '../store/dataStore';
import {
  ProjectCategory,
  ProjectStats
} from '../components/Projects/models';

export function useProjects() {
  const store = useDataStore();
  const data = store.getData('projects') as ProjectCategory[] | null;
  const loading = store.isLoading('projects');
  const error = store.getError('projects');
  const metadata = store.getMetadata('projects');

  // Projects-specific business logic
  const getProjectsByTag = useCallback(
    (tag: string) => {
      if (!data) return [];

      const allProjects = data.flatMap((cat) =>
        cat.subCategories.flatMap((sub) => sub.projects)
      );

      return allProjects.filter((project) =>
        project.tags?.some((projectTag) =>
          projectTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
    },
    [data]
  );

  const getProjectsByCategory = useCallback(
    (category: string) => {
      if (!data) return [];

      const categoryData = data.find(
        (cat) => cat.category.toLowerCase() === category.toLowerCase()
      );

      if (!categoryData) return [];

      return categoryData.subCategories.flatMap((sub) => sub.projects);
    },
    [data]
  );

  const getRecentProjects = useCallback(
    (monthsBack: number = 6) => {
      if (!data) return [];

      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);

      const allProjects = data.flatMap((cat) =>
        cat.subCategories.flatMap((sub) => sub.projects)
      );

      return allProjects
        .filter((project) => {
          if (!project.lastModified) return false;

          const projectDate = new Date(project.lastModified);
          
          return projectDate > cutoffDate;
        })
        .sort((a, b) => {
          const dateA = new Date(a.lastModified!);
          const dateB = new Date(b.lastModified!);
          
          return dateB.getTime() - dateA.getTime(); // Most recent first
        });
    },
    [data]
  );

  const getAllProjects = useCallback(() => {
    if (!data) return [];

    return data.flatMap((cat) =>
      cat.subCategories.flatMap((sub) => sub.projects)
    );
  }, [data]);

  const getProjectStats = useCallback((): ProjectStats => {
    if (!data) {
      return {
        totalProjects: 0,
        recentProjects: 0,
        totalTechnologies: 0,
        averageAge: 'N/A'
      };
    }

    const allProjects = getAllProjects();
    const recentProjects = getRecentProjects();

    // Calculate unique technologies from all tags
    const allTags = new Set(
      allProjects.flatMap((project) => project.tags || [])
    );

    // Calculate average age
    const projectsWithDates = allProjects.filter((p) => p.lastModified);
    let averageAge = 'N/A';

    if (projectsWithDates.length > 0) {
      const now = new Date();
      const totalDays = projectsWithDates.reduce((sum, project) => {
        const projectDate = new Date(project.lastModified!);
        const daysDiff = Math.floor(
          (now.getTime() - projectDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return sum + daysDiff;
      }, 0);

      const avgDays = Math.floor(totalDays / projectsWithDates.length);

      if (avgDays < 30) {
        averageAge = `${avgDays} days`;
      } else if (avgDays < 365) {
        averageAge = `${Math.floor(avgDays / 30)} months`;
      } else {
        averageAge = `${Math.floor(avgDays / 365)} years`;
      }
    }

    return {
      totalProjects: allProjects.length,
      recentProjects: recentProjects.length,
      totalTechnologies: allTags.size,
      averageAge
    };
  }, [data, getAllProjects, getRecentProjects]);

  const getAvailableTags = useCallback(() => {
    if (!data) return [];

    const allTags = new Set(
      data.flatMap((cat) =>
        cat.subCategories.flatMap((sub) =>
          sub.projects.flatMap((project) => project.tags || [])
        )
      )
    );

    return Array.from(allTags).sort();
  }, [data]);

  const getAvailableCategories = useCallback(() => {
    if (!data) return [];

    return data.map((cat) => cat.category);
  }, [data]);

  return {
    data,
    loading,
    error,
    metadata,
    // Business logic methods
    getProjectsByTag,
    getProjectsByCategory,
    getRecentProjects,
    getAllProjects,
    getProjectStats,
    getAvailableTags,
    getAvailableCategories
  };
}
