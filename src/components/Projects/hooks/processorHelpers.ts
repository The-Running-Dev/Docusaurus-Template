import { ProcessedCategory, FilterOption, ProjectStats } from '../models';

/**
 * Calculate project statistics
 */
export function calculateStats(categories: ProcessedCategory[]): ProjectStats {
  let totalProjects = 0;
  let recentProjects = 0;
  let totalAge = 0;
  let projectsWithDates = 0;
  const totalTechnologies = categories.reduce(
    (count, cat) => count + cat.subCategories.length,
    0
  );

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  categories.forEach((category) => {
    category.subCategories.forEach((subCategory) => {
      totalProjects += subCategory.projects.length;

      subCategory.projects.forEach((project) => {
        if (project.lastModified) {
          const projectDate = new Date(project.lastModified);
          if (projectDate >= sixMonthsAgo) {
            recentProjects++;
          }

          const age =
            (new Date().getTime() - projectDate.getTime()) /
            (365 * 24 * 60 * 60 * 1000);

          totalAge += age;
          projectsWithDates++;
        }
      });
    });
  });

  const averageAge =
    projectsWithDates > 0 ? Math.round(totalAge / projectsWithDates) : 0;

  return {
    totalProjects,
    recentProjects,
    totalTechnologies,
    averageAge: `${averageAge}y`
  };
}

/**
 * Create category text description
 */
export function createCategoryText(categories: ProcessedCategory[]): string {
  const categoryNames = categories.map((cat) => cat.category);

  if (categoryNames.length === 0) return 'Development';
  if (categoryNames.length === 1) return categoryNames[0];

  return `${categoryNames.slice(0, -1).join(', ')} & ${categoryNames[categoryNames.length - 1]}`;
}

/**
 * Generate technology filter options
 */
export function generateTechnologyOptions(
  categories: ProcessedCategory[]
): FilterOption[] {
  // Calculate total projects for "All" option
  const totalProjects = categories.reduce(
    (total, cat) =>
      total +
      cat.subCategories.reduce(
        (subTotal, sub) => subTotal + sub.projects.length,
        0
      ),
    0
  );

  // Create all technology options with project counts, sorted by project count
  const allTechOptions = categories
    .flatMap((cat) =>
      cat.subCategories.map((sub) => ({
        key: `${cat.category}-${sub.name}`,
        label: `${sub.name} (${sub.projects.length})`,
        category: cat.category,
        count: sub.projects.length
      }))
    )
    .sort((a, b) => b.count - a.count); // Sort by project count descending

  return [
    { key: 'all', label: `All (${totalProjects})`, category: '' },
    ...allTechOptions
  ];
}

/**
 * Generate category filter options
 */
export function generateCategoryOptions(
  categories: ProcessedCategory[]
): FilterOption[] {
  // Calculate total projects for "All" option
  const totalProjects = categories.reduce(
    (total, cat) =>
      total +
      cat.subCategories.reduce(
        (subTotal, sub) => subTotal + sub.projects.length,
        0
      ),
    0
  );

  return [
    { key: 'all', label: `All (${totalProjects})` },
    ...categories.map((cat) => {
      const categoryProjectCount = cat.subCategories.reduce(
        (count, sub) => count + sub.projects.length,
        0
      );
      return {
        key: cat.category,
        label: `${cat.category} (${categoryProjectCount})`
      };
    })
  ];
}

/**
 * Generate date filter options
 */
export function generateDateOptions(
  categories: ProcessedCategory[]
): FilterOption[] {
  // Collect all project dates to determine what options to show
  const allDates: Date[] = [];

  categories.forEach((category) => {
    category.subCategories.forEach((subCategory) => {
      subCategory.projects.forEach((project) => {
        if (project.lastModified) {
          allDates.push(new Date(project.lastModified));
        }
      });
    });
  });

  if (allDates.length === 0) {
    return [{ key: 'most-recent', label: 'Most Recent' }];
  }

  // Sort dates to find the range
  allDates.sort((a, b) => b.getTime() - a.getTime()); // Most recent first

  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  const threeMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 3,
    now.getDate()
  );
  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 6,
    now.getDate()
  );
  const oneYearAgo = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate()
  );

  // Count projects in each date range
  const mostRecentCount = allDates.filter(
    (date) => date >= sixMonthsAgo
  ).length;
  const lastMonthCount = allDates.filter((date) => date >= oneMonthAgo).length;
  const last3MonthsCount = allDates.filter(
    (date) => date >= threeMonthsAgo
  ).length;
  const last6MonthsCount = allDates.filter(
    (date) => date >= sixMonthsAgo
  ).length;
  const lastYearCount = allDates.filter((date) => date >= oneYearAgo).length;
  const olderCount = allDates.filter((date) => date < oneYearAgo).length;
  const allTimeCount = allDates.length;

  const options: FilterOption[] = [
    { key: 'most-recent', label: `Most Recent (${mostRecentCount})` }
  ];

  // Add options based on available data
  if (allDates.some((date) => date >= oneMonthAgo)) {
    options.push({
      key: 'last-month',
      label: `Last Month (${lastMonthCount})`
    });
  }

  if (allDates.some((date) => date >= threeMonthsAgo)) {
    options.push({
      key: 'last-3-months',
      label: `Last 3 Months (${last3MonthsCount})`
    });
  }

  if (allDates.some((date) => date >= sixMonthsAgo)) {
    options.push({
      key: 'last-6-months',
      label: `Last 6 Months (${last6MonthsCount})`
    });
  }

  if (allDates.some((date) => date >= oneYearAgo)) {
    options.push({ key: 'last-year', label: `Last Year (${lastYearCount})` });
  }

  if (allDates.some((date) => date < oneYearAgo)) {
    options.push({ key: 'older', label: `Older than 1 Year (${olderCount})` });
  }

  options.push({ key: 'all-dates', label: `All Time (${allTimeCount})` });

  return options;
}

/**
 * Apply date filtering to categories
 */
export function applyDateFiltering(
  categories: ProcessedCategory[],
  dateRange?: string
): ProcessedCategory[] {
  const sortProjectsByDate = (projects: any[]) => {
    return [...projects].sort((a, b) => {
      const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;

      // If both have dates, sort by date (most recent first)
      if (dateA > 0 && dateB > 0) {
        return dateB - dateA; // Most recent first
      }

      // If only one has a date, prioritize the one with a date
      if (dateA > 0 && dateB === 0) return -1;
      if (dateB > 0 && dateA === 0) return 1;

      // If neither has a date, maintain original order
      return 0;
    });
  };

  if (!dateRange || dateRange === 'all-dates') {
    // Show all projects sorted by most recent
    return categories.map((category) => ({
      ...category,
      subCategories: category.subCategories.map((subCategory) => ({
        ...subCategory,
        projects: sortProjectsByDate(subCategory.projects)
      }))
    }));
  }

  if (dateRange === 'most-recent') {
    // Show projects from last 6 months for "most recent"
    const now = new Date();
    const sixMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 6,
      now.getDate()
    );

    return categories
      .map((category) => ({
        ...category,
        subCategories: category.subCategories
          .map((subCategory) => ({
            ...subCategory,
            projects: sortProjectsByDate(
              subCategory.projects.filter((project) => {
                if (!project.lastModified) return false;
                const projectDate = new Date(project.lastModified);
                return projectDate >= sixMonthsAgo;
              })
            )
          }))
          .filter((subCategory) => subCategory.projects.length > 0)
      }))
      .filter((category) => category.subCategories.length > 0);
  }

  const now = new Date();
  const getDateThreshold = (range: string): Date => {
    switch (range) {
      case 'last-month':
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case 'last-3-months':
        return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      case 'last-6-months':
        return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      case 'last-year':
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      case 'older':
        return new Date(0); // Show projects older than 1 year
      default:
        return new Date(0);
    }
  };

  const threshold = getDateThreshold(dateRange);

  return categories
    .map((category) => ({
      ...category,
      subCategories: category.subCategories
        .map((subCategory) => ({
          ...subCategory,
          projects: sortProjectsByDate(
            subCategory.projects.filter((project) => {
              if (!project.lastModified) return dateRange === 'older';
              const projectDate = new Date(project.lastModified);

              if (dateRange === 'older') {
                const oneYearAgo = new Date(
                  now.getFullYear() - 1,
                  now.getMonth(),
                  now.getDate()
                );
                return projectDate < oneYearAgo;
              }

              return projectDate >= threshold;
            })
          )
        }))
        .filter((subCategory) => subCategory.projects.length > 0)
    }))
    .filter((category) => category.subCategories.length > 0);
}

/**
 * Generate tag filter options
 */
export function generateTagOptions(
  categories: ProcessedCategory[]
): FilterOption[] {
  // Collect all unique tags from all projects
  const tagCounts = new Map<string, number>();

  categories.forEach((cat) => {
    cat.subCategories.forEach((sub) => {
      sub.projects.forEach((project) => {
        if (project.tags) {
          project.tags.forEach((tag) => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
          });
        }
      });
    });
  });

  // Convert to FilterOption array with project counts, sorted by count (descending)
  const tagOptions = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({
      key: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`,
      label: `${tag} (${count})`,
      category: 'tag',
      count: count // Add count for sorting
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  // Calculate total projects for "All Tags" option
  const totalProjectsWithTags = categories.reduce(
    (total, cat) =>
      total +
      cat.subCategories.reduce(
        (subTotal, sub) =>
          subTotal +
          sub.projects.filter(
            (project) => project.tags && project.tags.length > 0
          ).length,
        0
      ),
    0
  );

  return [
    {
      key: 'all-tags',
      label: `All (${totalProjectsWithTags})`,
      category: 'tag',
      count: totalProjectsWithTags
    },
    ...tagOptions
  ];
}
