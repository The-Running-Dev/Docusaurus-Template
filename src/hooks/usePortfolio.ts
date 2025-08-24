import { useCallback } from 'react';
import { useDataStore } from '../store/dataStore';
import {
  PortfolioData,
  FlattenedTechnologyItem
} from '../components/Portfolio/models';

export function usePortfolio() {
  const store = useDataStore();
  const data = store.getData('portfolio') as PortfolioData | null;
  const loading = store.isLoading('portfolio');
  const error = store.getError('portfolio');
  const metadata = store.getMetadata('portfolio');

  // Portfolio-specific business logic
  const getProjectsByCategory = useCallback(
    (category: string) => {
      if (!data?.projects) return [];
      return data.projects.filter((p) =>
        p.category?.toLowerCase().includes(category.toLowerCase())
      );
    },
    [data]
  );

  const getTechnologiesByCategory = useCallback(
    (category: string) => {
      if (!data?.technologies) return [];
      return data.technologies.filter((tech) =>
        tech.name.toLowerCase().includes(category.toLowerCase())
      );
    },
    [data]
  );

  const getFlattenedTechnologies =
    useCallback((): FlattenedTechnologyItem[] => {
      if (!data?.technologies) return [];

      return data.technologies.flatMap((category) => {
        const categoryName = category.name;

        if (!category.subCategories || category.subCategories.length === 0) {
          return [
            {
              name: categoryName,
              link: category.link,
              category: categoryName,
              subCategories: undefined
            }
          ];
        }

        return category.subCategories.map((subCat) => ({
          name: subCat.name,
          link: subCat.link,
          category: categoryName,
          subCategories: subCat.subCategories || undefined
        }));
      });
    }, [data]);

  const getStats = useCallback(() => {
    if (!data) return null;

    return {
      totalProjects: data.projects?.length || 0,
      totalTechnologies: data.technologies?.length || 0,
      totalSubCategories:
        data.technologies?.reduce(
          (total, tech) => total + (tech.subCategories?.length || 0),
          0
        ) || 0,
      totalStats: data.stats?.length || 0,
      stats: data.stats || []
    };
  }, [data]);

  return {
    data,
    loading,
    error,
    metadata,
    // Business logic methods
    getProjectsByCategory,
    getTechnologiesByCategory,
    getFlattenedTechnologies,
    getStats
  };
}
