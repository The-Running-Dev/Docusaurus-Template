import type { ReactNode, RefObject } from 'react';
import { useState, useEffect, useCallback } from 'react';

import DebugInfo from '../DebugInfo';
import Loading from '../Loading';
import { useFeaturesConfig } from '../../config';
import { useProjects } from '../../hooks/useProjects';
import { type ProcessedProjectData } from './models';
import { useProcessor, useUrlFilter, useSearch, useScrollRefs } from './hooks';
import { FilterErrorBoundary } from './components/FilterErrorBoundary';
import {
  SearchBox,
  DateFilters,
  CategoryFilters,
  TagFilters,
  ProjectResults,
  ProjectHeader,
  ProjectStats
} from './components';

import './projects.css';
import './projects-reader.css';
import './projects-transitions.css';

/**
 * Enhanced Projects component using Global Store architecture
 * This component works with static or http data and provides
 * all filtering/search functionality
 */
export default function Projects(): ReactNode {
  const features = useFeaturesConfig();
  const { data, loading, error } = useProjects();

  if (!features.projectsPage) {
    return null;
  }

  if (loading) {
    return (
      <Loading
        message="🔄 Loading Projects..."
        secondaryMessage="Fetching Data and Filtering..."
        useWrap={true}
      />
    );
  }

  if (error) {
    return (
      <div className="portfolio-wrap">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p className="portfolio-muted" style={{ color: '#d32f2f' }}>
            ❌ Data Loading Error
          </p>
          <p
            style={{
              fontSize: '0.9rem',
              color: '#666',
              marginTop: '0.5rem'
            }}
          >
            {error.message}
          </p>
          <p
            style={{
              fontSize: '0.8rem',
              color: '#888',
              marginTop: '1rem'
            }}
          >
            Please Check Your Data Source Configuration.
          </p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="portfolio-wrap">
        <p className="portfolio-muted">No Projects Found.</p>
      </div>
    );
  }

  return (
    <FilterErrorBoundary>
      <ProjectsContent rawData={data} />
    </FilterErrorBoundary>
  );
}

/**
 * Inner component that handles all the projects logic
 * Separated to keep the main component wrapper clean
 */
function ProjectsContent({ rawData }: { rawData: any[] }): ReactNode {
  const {
    selectedFilter,
    setSelectedFilter,
    isLoading: isFilterLoading
  } = useUrlFilter();
  const { searchTerm, setSearchTerm, searchInputRef, handleClearSearch } =
    useSearch();
  const { filtersRef, projectsRef, scrollToProjects, scrollToFilters } =
    useScrollRefs();

  // Initialize date range state
  const [selectedDateRange, setSelectedDateRange] = useState('most-recent');

  // Process data using the processor hook
  const {
    processedData,
    loading: processingLoading,
    error: processingError
  } = useProcessor(rawData || [], {
    selectedCategory: selectedFilter,
    selectedDateRange,
    searchTerm
  });

  // Auto-set date range to "all-dates" when searching
  useEffect(() => {
    if (searchTerm) {
      setSelectedDateRange('all-dates');
    } else {
      setSelectedDateRange('most-recent');
    }
  }, [searchTerm]);

  // Auto-set date range to "all-dates" when category, sub-category, or tag is selected
  useEffect(() => {
    if (
      selectedFilter &&
      selectedFilter !== 'most-recent' &&
      selectedFilter !== 'all' &&
      selectedFilter !== 'all-dates'
    ) {
      setSelectedDateRange('all-dates');
    } else if (
      !searchTerm &&
      (selectedFilter === 'most-recent' || selectedFilter === 'all' || !selectedFilter)
    ) {
      setSelectedDateRange('most-recent');
    }
  }, [selectedFilter, searchTerm]);

  const handleFilterToggle = useCallback(
    (filterKey: string) => {
      if (selectedFilter === filterKey) {
        // If clicking the same filter, toggle it off by setting to most-recent default
        setSelectedFilter('most-recent');
      } else {
        // Otherwise select the new filter
        setSelectedFilter(filterKey);
      }
    },
    [selectedFilter, setSelectedFilter]
  );


  // Correct the filter case once processedData is available
  useEffect(() => {
    if (processedData && selectedFilter) {
      // Find matching category option with case-insensitive comparison
      const matchingOption = processedData.categoryOptions.find(
        (option) => option.key.toLowerCase() === selectedFilter.toLowerCase()
      );

      if (matchingOption && matchingOption.key !== selectedFilter) {
        setSelectedFilter(matchingOption.key);
      }
    }
  }, [processedData, selectedFilter, setSelectedFilter]);

  // Handle processing error
  if (processingError) {
    return (
      <div className="portfolio-wrap">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p className="portfolio-muted" style={{ color: '#d32f2f' }}>
            ❌ Data Processing Error
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            {processingError.message}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '1rem' }}>
            There was an issue processing the project data. Please try
            refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // Handle processing loading
  if (processingLoading || !processedData) {
    return <Loading message="🔄 Processing Data..." useWrap={true} />;
  }

  return (
    <>
      <ProjectHeader categoryText={processedData.categoryText} />
      <main>
        <ProjectStats stats={processedData.stats} />
        <ProjectFiltersAndResults
          processedData={processedData}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          searchInputRef={searchInputRef}
          handleClearSearch={handleClearSearch}
          handleFilterToggle={handleFilterToggle}
          filtersRef={filtersRef}
          projectsRef={projectsRef}
          scrollToProjects={scrollToProjects}
          scrollToFilters={scrollToFilters}
          isFilterLoading={isFilterLoading}
        />
      </main>
      <DebugInfo
        meta={undefined}
        metrics={[
          {
            label: '📁 Projects',
            value: processedData.stats.totalProjects
          },
          {
            label: '🕒 Recent',
            value: processedData.stats.recentProjects
          },
          {
            label: '🧬 Technologies',
            value: processedData.stats.totalTechnologies
          },
          {
            label: '📅 Average Age',
            value: processedData.stats.averageAge
          }
        ]}
      />
    </>
  );
}

function ProjectFiltersAndResults({
  processedData,
  searchTerm,
  setSearchTerm,
  selectedFilter,
  selectedDateRange,
  setSelectedDateRange,
  searchInputRef,
  handleClearSearch,
  handleFilterToggle,
  filtersRef,
  projectsRef,
  scrollToProjects,
  scrollToFilters,
  isFilterLoading
}: {
  processedData: ProcessedProjectData;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilter: string;
  selectedDateRange: string;
  setSelectedDateRange: (range: string) => void;
  searchInputRef: RefObject<HTMLInputElement>;
  handleClearSearch: () => void;
  handleFilterToggle: (filterKey: string) => void;
  filtersRef: RefObject<HTMLDivElement>;
  projectsRef: RefObject<HTMLDivElement>;
  scrollToProjects: () => void;
  scrollToFilters: () => void;
  isFilterLoading: boolean;
}) {
  return (
    <section className="projectCategories" ref={filtersRef}>
      <div className="container">
        <div className="projectControls">
          <SearchBox
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchInputRef={searchInputRef}
            handleClearSearch={handleClearSearch}
          />
        </div>

        <div className="filterSection">
          <DateFilters
            dateOptions={processedData.dateOptions}
            selectedDateRange={selectedDateRange}
            onDateChange={(key) => {
              setSelectedDateRange(key);
              scrollToProjects();
            }}
            searchTerm={searchTerm}
          />

          <CategoryFilters
            categoryOptions={processedData.categoryOptions}
            activeFilter={selectedFilter}
            onFilterChange={(key) => {
              handleFilterToggle(key);
              scrollToProjects();
            }}
            searchTerm={searchTerm}
            processedData={processedData}
            isLoading={isFilterLoading}
          />

          <CategoryFilters
            categoryOptions={processedData.technologyOptions}
            activeFilter={selectedFilter}
            onFilterChange={(key) => {
              handleFilterToggle(key);
              scrollToProjects();
            }}
            searchTerm={searchTerm}
            processedData={processedData}
            isLoading={isFilterLoading}
            title="Technologies"
          />

          <TagFilters
            tagTiers={processedData.tagTiers}
            activeTag={selectedFilter}
            onTagChange={(key) => {
              handleFilterToggle(key);
              scrollToProjects();
            }}
          />
          
          <div ref={projectsRef}></div>
        </div>

        <ProjectResults
          filteredCategories={processedData.categories}
          searchTerm={searchTerm}
          activeFilter={selectedFilter}
          onFilterToggle={handleFilterToggle}
          onScrollToFilters={scrollToFilters}
        />
      </div>
    </section>
  );
}

