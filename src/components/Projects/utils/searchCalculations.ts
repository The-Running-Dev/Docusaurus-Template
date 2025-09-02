import {
  FilterOption,
  ProcessedProjectData
} from '../../../../shared/types/project-types';

/**
 * Utility functions for calculating search results in filter buttons
 */

/**
 * Calculate search results for category filters
 */
export function calculateCategoryResults(
  processedData: ProcessedProjectData,
  option: FilterOption,
  totalProjects: number
) {
  if (option.key === 'all') {
    return {
      searchResultCount: processedData.categories.reduce(
        (total, cat) =>
          total +
          cat.subCategories.reduce(
            (subTotal, sub) => subTotal + sub.projects.length,
            0
          ),
        0
      ),
      totalCategoryProjects: totalProjects
    };
  } else {
    const matchingCategory = processedData.categories.find(
      (cat) => cat.category === option.key.toLowerCase()
    );
    const searchResultCount = matchingCategory
      ? matchingCategory.subCategories.reduce(
          (total, sub) => total + sub.projects.length,
          0
        )
      : 0;

    const labelMatch = option.label.match(/\((\d+)\)$/);
    const totalCategoryProjects = labelMatch
      ? parseInt(labelMatch[1])
      : searchResultCount;

    return { searchResultCount, totalCategoryProjects };
  }
}

/**
 * Calculate search results for technology filters
 */
export function calculateTechnologyResults(
  processedData: ProcessedProjectData,
  option: FilterOption,
  totalProjects: number
) {
  if (option.key === 'all') {
    return {
      searchResultCount: processedData.categories.reduce(
        (total, cat) =>
          total +
          cat.subCategories.reduce(
            (subTotal, sub) => subTotal + sub.projects.length,
            0
          ),
        0
      ),
      totalTechnologyProjects: totalProjects
    };
  } else {
    let searchResultCount = 0;
    processedData.categories.forEach((cat) => {
      cat.subCategories.forEach((sub) => {
        if (
          option.key.endsWith(`-${sub.name}`) ||
          (option.category &&
            cat.category === option.category &&
            sub.name === option.label)
        ) {
          searchResultCount += sub.projects.length;
        }
      });
    });

    const labelMatch = option.label.match(/\((\d+)\)$/);
    const totalTechnologyProjects = labelMatch
      ? parseInt(labelMatch[1])
      : searchResultCount;

    return { searchResultCount, totalTechnologyProjects };
  }
}
