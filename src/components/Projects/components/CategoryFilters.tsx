import { type ReactNode } from 'react';
import {
  FilterOption,
  ProcessedProjectData
} from '../../../../shared/types/project-types';
import { FilterButton } from './FilterButton';
import { calculateCategoryResults } from '../utils';

interface CategoryFiltersProps {
  categoryOptions: FilterOption[];
  activeFilter?: string;
  onFilterChange: (filter: string) => void;
  searchTerm?: string;
  processedData?: ProcessedProjectData;
  isLoading?: boolean;
  title?: string;
}

export default function CategoryFilters({
  categoryOptions,
  activeFilter,
  onFilterChange,
  searchTerm,
  processedData,
  isLoading = false,
  title = 'Categories'
}: CategoryFiltersProps): ReactNode {
  return (
    <div className="filterGroup">
      <div className="filterButtons">
        <span className="filterGroupTitle">{title}:</span>
        {categoryOptions.map((option) => {
          // Calculate search results if we have search term and processed data
          let hasResults = false;
          let searchResultCount = 0;
          let totalCount = 0;

          if (searchTerm && processedData) {
            // Get total projects for this option from the original data
            const labelMatch = option.label.match(/\((\d+)\)$/);

            totalCount = labelMatch ? parseInt(labelMatch[1]) : 0;

            // Calculate current search results
            const results = calculateCategoryResults(
              processedData,
              option,
              totalCount
            );

            searchResultCount = results.searchResultCount;
            hasResults = searchResultCount > 0;
          }

          // Check if this option is selected, handling both direct match and category- prefix
          const isSelected =
            activeFilter === option.key ||
            (activeFilter?.startsWith('category-') &&
              activeFilter.replace('category-', '').toLowerCase() ===
                option.key.toLowerCase());

          return (
            <FilterButton
              key={option.key}
              option={option}
              isSelected={isSelected}
              isDisabled={searchTerm ? !hasResults : false}
              isLoading={isLoading}
              hasSearchResults={hasResults}
              searchResultCount={searchResultCount}
              totalCount={totalCount}
              onClick={onFilterChange}
              searchTerm={searchTerm}
            />
          );
        })}
      </div>
    </div>
  );
}
