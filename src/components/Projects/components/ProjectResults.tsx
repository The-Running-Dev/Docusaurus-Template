import { type ReactNode } from 'react';
import { ProcessedCategory } from '../models';
import ProjectGrid from './ProjectGrid';

interface ProjectResultsProps {
  filteredCategories: ProcessedCategory[];
  searchTerm: string;
  activeFilter: string;
  onFilterToggle: (filter: string) => void;
  onScrollToFilters: () => void;
}

/**
 * ProjectResults component
 * Wrapper around ProjectGrid to display filtered project results
 */
export default function ProjectResults({
  filteredCategories,
  searchTerm,
  activeFilter,
  onFilterToggle,
  onScrollToFilters
}: ProjectResultsProps): ReactNode {
  // Handle no results case
  if (!filteredCategories || filteredCategories.length === 0) {
    return (
      <div className="projectResults">
        <div className="noResults" style={{ textAlign: 'center' }}>
          <h3>No Projects Found</h3>
          <p>Try adjusting your search terms or filters.</p>
          <button onClick={onScrollToFilters} className="backToFiltersButton">
            ↑ Back to Filters
          </button>
        </div>
      </div>
    );
  }

  // Calculate total projects count
  const totalProjects = filteredCategories.reduce(
    (total, category) =>
      total +
      category.subCategories.reduce(
        (catTotal, subCat) => catTotal + subCat.projects.length,
        0
      ),
    0
  );

  return (
    <div className="projectResults">
      <div className="resultsHeader" style={{ textAlign: 'center' }}>
        <h2>
          {searchTerm
            ? `"${searchTerm}" Project${totalProjects !== 1 ? 's' : ''}: ${totalProjects}`
            : `Project${totalProjects !== 1 ? 's' : ''}: ${totalProjects}`}
        </h2>
      </div>

      <ProjectGrid
        categories={filteredCategories}
        searchTerm={searchTerm}
        activeFilter={activeFilter}
        onFilterToggle={onFilterToggle}
        onScrollToFilters={onScrollToFilters}
      />
    </div>
  );
}
