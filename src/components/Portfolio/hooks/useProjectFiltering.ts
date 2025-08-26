import { useFeaturesConfig } from '../../../config';
import { useProjects } from '../../../hooks';

export function useProjectFiltering() {
  const features = useFeaturesConfig();
  const { getProjectsByTag, getProjectsByCategory } = useProjects();

  const shouldCreateLink = (
    configuredLink: string | undefined,
    filter: string
  ): boolean => {
    if (!features.projectsPage) {
      return false;
    }

    // If there's a configured link, always create the link
    if (configuredLink) {
      return true;
    }

    // For tag filters, check if projects exist for this tag
    if (filter.startsWith('tag-')) {
      const tagName = filter.replace('tag-', '');
      const projectsForTag = getProjectsByTag(tagName);

      return projectsForTag.length > 0;
    }

    // For category filters, check if projects exist for this category
    if (filter.startsWith('category-')) {
      const categoryName = filter.replace('category-', '');
      const projectsForCategory = getProjectsByCategory(categoryName);

      return projectsForCategory.length > 0;
    }

    return true;
  };

  const getFilterLink = (
    configuredLink: string | undefined,
    filter: string
  ): string => {
    return configuredLink || `/projects?filter=${encodeURIComponent(filter)}`;
  };

  return {
    shouldCreateLink,
    getFilterLink,
    hasProjectsPage: features.projectsPage
  };
}
