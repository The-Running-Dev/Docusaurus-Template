import { useMemo, useState } from 'react';
import { getData } from '../../../data';
import { ProcessedProjectData, ProcessedCategory } from '../models';
import {
  calculateStats,
  createCategoryText,
  generateTechnologyOptions,
  generateCategoryOptions,
  generateDateOptions,
  generateTagOptions,
  applyDateFiltering
} from '../utils';

/**
 * Processor configuration options
 */
export interface ProcessorOptions {
  selectedCategory?: string;
  selectedDateRange?: string;
  searchTerm?: string;
}

/**
 * Processor hook result
 */
export interface ProcessorResult {
  processedData: ProcessedProjectData;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for processing project data
 * Transforms raw data into filtered, sorted, and enriched project data
 * This hook is pure data transformation - it doesn't fetch data
 */
export function useProcessor(
  rawData: any[] | null,
  options: ProcessorOptions = {}
): ProcessorResult {
  const { selectedCategory, selectedDateRange, searchTerm } = options;

  // Processing loading state
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Process raw data using getData with processor
  const processedData = useMemo(() => {
    // No data to process
    if (!rawData || !Array.isArray(rawData)) {
      return getEmptyProcessedData();
    }

    setProcessing(true);
    setError(null); // Clear previous errors

    try {
      // Process the raw data using existing logic
      const { processedCategories, stats, categoryText } = getData(rawData, {
        processor: (data) => {
          return processData(data);
        }
      });

      // Apply filtering based on options
      const filteredData = applyFiltering(processedCategories, {
        selectedCategory,
        selectedDateRange,
        searchTerm
      });

      // Generate filter options
      const technologyOptions = generateTechnologyOptions(processedCategories);
      const categoryOptions = generateCategoryOptions(processedCategories);
      const dateOptions = generateDateOptions(processedCategories);
      const tagOptions = generateTagOptions(processedCategories);

      const result: ProcessedProjectData = {
        categories: filteredData,
        technologyOptions,
        categoryOptions,
        dateOptions,
        tagOptions,
        stats,
        categoryText
      };

      return result;
    } catch (err) {
      const processingError =
        err instanceof Error ? err : new Error('Unknown processing error');
      setError(processingError);
      return getEmptyProcessedData();
    } finally {
      setProcessing(false);
    }
  }, [rawData, selectedCategory, selectedDateRange, searchTerm]);

  // Return result with loading state and error
  return {
    processedData,
    loading: processing,
    error
  };
} /**
 * Helper function to get empty processed data structure
 */
function getEmptyProcessedData(): ProcessedProjectData {
  return {
    categories: [],
    technologyOptions: [{ key: 'all', label: 'All (0)', category: '' }],
    categoryOptions: [{ key: 'all', label: 'All (0)' }],
    dateOptions: [{ key: 'most-recent', label: 'Most Recent (0)' }],
    tagOptions: [
      { key: 'all-tags', label: 'All (0)', category: 'tag', count: 0 }
    ],
    stats: {
      totalProjects: 0,
      recentProjects: 0,
      totalTechnologies: 0,
      averageAge: '0y'
    },
    categoryText: 'Development'
  };
}

// Import all the existing processing functions from the original useConfig
// (I'll add these in the next step since they're quite long)

function processData(rawData: any[]) {
  // ... (existing processData function from useConfig)
  const categories = Array.isArray(rawData) ? rawData : [];

  // Process categories with proper null/undefined checks
  const processedCategories: ProcessedCategory[] = categories
    .filter((category) => category && typeof category === 'object') // Filter out invalid categories
    .map((category, categoryIndex) => {
      return {
        category: category.category || `Unknown-Category-${categoryIndex}`,
        subCategories: (Array.isArray(category.subCategories)
          ? category.subCategories
          : []
        )
          .filter((sub: any) => sub && typeof sub === 'object') // Filter out invalid subcategories
          .map((sub: any, subIndex: number) => ({
            name:
              sub.name || `Unknown-Subcategory-${categoryIndex}-${subIndex}`,
            projects: (Array.isArray(sub.projects) ? sub.projects : [])
              .filter((project: any) => project && typeof project === 'object') // Filter out invalid projects
              .map((project: any) => ({
                title: project.title || 'Untitled',
                summary: project.summary || 'No summary available',
                lastModified: project.lastModified || null,
                link: project.link || null,
                ...project // Include any other properties
              }))
          }))
          // Sort sub-categories by number of projects (descending)
          .sort((a, b) => b.projects.length - a.projects.length)
      };
    })
    // Sort categories by total number of projects (descending)
    .sort((a, b) => {
      const totalProjectsA = a.subCategories.reduce(
        (sum, sub) => sum + sub.projects.length,
        0
      );
      const totalProjectsB = b.subCategories.reduce(
        (sum, sub) => sum + sub.projects.length,
        0
      );

      return totalProjectsB - totalProjectsA;
    });

  // Calculate statistics
  const stats = calculateStats(processedCategories);

  // Generate category text
  const categoryText = createCategoryText(processedCategories);

  return {
    processedCategories,
    stats,
    categoryText
  };
}

function applyFiltering(
  processedCategories: ProcessedCategory[],
  options: {
    selectedCategory?: string;
    selectedDateRange?: string;
    searchTerm?: string;
  }
): ProcessedCategory[] {
  const { selectedCategory, selectedDateRange, searchTerm } = options;

  let filteredCategories = processedCategories;

  // Apply search filter first - search across ALL projects regardless of category
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    filteredCategories = processedCategories
      .map((category) => ({
        ...category,
        subCategories: category.subCategories
          .map((subCategory) => ({
            ...subCategory,
            projects: subCategory.projects.filter(
              (project) =>
                project.title.toLowerCase().includes(lowerSearchTerm) ||
                project.summary.toLowerCase().includes(lowerSearchTerm) ||
                (project.tags &&
                  project.tags.some((tag) =>
                    tag.toLowerCase().includes(lowerSearchTerm)
                  ))
            )
          }))
          .filter((subCategory) => subCategory.projects.length > 0)
      }))
      .filter((category) => category.subCategories.length > 0);

    // Apply date filtering to search results using consistent logic
    let finalDateRange = selectedDateRange; // Prioritize explicitly selected date range

    // Handle special cases
    if (selectedCategory && selectedCategory.startsWith('tag-')) {
      finalDateRange = 'all-dates'; // Skip date filtering for tag filters
    } else if (!finalDateRange && selectedCategory === 'most-recent') {
      finalDateRange = 'most-recent'; // Default for most-recent category
    } else if (!finalDateRange) {
      finalDateRange = 'all-dates'; // Default fallback
    }

    filteredCategories = applyDateFiltering(filteredCategories, finalDateRange);

    return filteredCategories;
  }

  // Apply category filter if no search term is active
  if (
    selectedCategory &&
    selectedCategory !== 'all' &&
    selectedCategory !== 'most-recent'
  ) {
    if (selectedCategory === 'all-tags') {
      // Show all projects that have any tags
      filteredCategories = processedCategories
        .map((cat) => ({
          ...cat,
          subCategories: cat.subCategories
            .map((sub) => ({
              ...sub,
              projects: sub.projects.filter(
                (project) => project.tags && project.tags.length > 0
              )
            }))
            .filter((sub) => sub.projects.length > 0)
        }))
        .filter((cat) => cat.subCategories.length > 0);
    } else if (selectedCategory.startsWith('tag-')) {
      // Tag filter
      const tagKey = selectedCategory.substring(4); // Remove 'tag-' prefix

      filteredCategories = processedCategories
        .map((cat) => ({
          ...cat,
          subCategories: cat.subCategories
            .map((sub) => ({
              ...sub,
              projects: sub.projects.filter((project) => {
                if (!project.tags || project.tags.length === 0) {
                  return false;
                }

                return project.tags.some((tag) => {
                  const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-');
                  return normalizedTag === tagKey;
                });
              })
            }))
            .filter((sub) => sub.projects.length > 0)
        }))
        .filter((cat) => cat.subCategories.length > 0);
    } else if (selectedCategory.startsWith('category-')) {
      // Handle Portfolio component's category- prefix format
      const categoryName = selectedCategory.replace('category-', '');
      
      filteredCategories = processedCategories.filter(
        (cat) => cat.category.toLowerCase() === categoryName.toLowerCase()
      );
    } else if (selectedCategory.includes('-')) {
      // Specific subcategory
      const [categoryName, subCategoryName] = selectedCategory.split('-');

      filteredCategories = processedCategories
        .filter(
          (cat) => cat.category.toLowerCase() === categoryName.toLowerCase()
        )
        .map((cat) => ({
          ...cat,
          subCategories: cat.subCategories.filter(
            (sub) => sub.name.toLowerCase() === subCategoryName.toLowerCase()
          )
        }));
    } else {
      // Specific category - case insensitive comparison
      filteredCategories = processedCategories.filter(
        (cat) => cat.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
  } else {
    // Default case: 'most-recent', 'all', or not set - create flattened view
    if (
      !selectedCategory ||
      selectedCategory === 'all' ||
      selectedCategory === 'most-recent'
    ) {
      // Flatten all projects into a single category for global sorting
      const allProjects = processedCategories.flatMap((cat) =>
        cat.subCategories.flatMap((sub) =>
          sub.projects.map((project) => ({
            ...project,
            category: cat.category,
            subCategory: sub.name
          }))
        )
      );

      // Create a single flattened category containing all projects
      filteredCategories = [
        {
          category: 'All Projects',
          subCategories: [
            {
              name: 'All',
              projects: allProjects
            }
          ]
        }
      ];
    } else {
      // Keep original structure for other cases
      filteredCategories = processedCategories;
    }
  }

  // Apply date filtering (but skip for tag filters to show all matching projects)
  let finalDateRange = selectedDateRange; // Prioritize explicitly selected date range

  // Handle special cases
  if (selectedCategory && selectedCategory.startsWith('tag-')) {
    finalDateRange = 'all-dates'; // Skip date filtering for tag filters
  } else if (!finalDateRange && selectedCategory === 'most-recent') {
    finalDateRange = 'most-recent'; // Default for most-recent category
  } else if (!finalDateRange) {
    finalDateRange = 'all-dates'; // Default fallback
  }

  filteredCategories = applyDateFiltering(filteredCategories, finalDateRange);

  return filteredCategories;
}

// I need to continue with the rest of the helper functions...
// Let me create them in a separate file due to length

export default useProcessor;
