import type { ReactNode, RefObject } from 'react';
import { useState, useEffect } from 'react';

import DebugInfo from '../DebugInfo';
import Loading from '../Loading';
import { useFeaturesConfig } from '../../config';
import { useProjects } from '../../hooks/useProjects';
import { type ProcessedCategory, type ProcessedProjectData } from './models';
import { useProcessor, useUrlFilter, useSearch, useScrollRefs } from './hooks';
import { FilterErrorBoundary } from './hooks/FilterErrorBoundary';
import {
  FilterButton,
  SearchBox,
  ProjectHeader,
  ProjectStats
} from './components';
import { calculateCategoryResults, calculateTechnologyResults } from './utils';

import './projects.css';
import './projects-reader.css';
import './hooks/filter-transitions.css';

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
function ProjectsContent({
  rawData
}: {
  rawData: any[];
}): ReactNode {
  const {
    selectedFilter,
    setSelectedFilter,
    isLoading: isFilterLoading
  } = useUrlFilter();
  const [selectedDateRange, setSelectedDateRange] = useState('most-recent');
  const [showAllTags, setShowAllTags] = useState(false);
  const { searchTerm, setSearchTerm, searchInputRef, handleClearSearch } =
    useSearch();
  const { filtersRef, projectsRef, scrollToProjects, scrollToFilters } =
    useScrollRefs();

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
      (selectedFilter === 'most-recent' ||
        selectedFilter === 'all' ||
        !selectedFilter)
    ) {
      setSelectedDateRange('most-recent');
    }
  }, [selectedFilter, searchTerm]);

  // Function to toggle filter selection
  const handleFilterToggle = (filterKey: string) => {
    if (selectedFilter === filterKey) {
      // If clicking the same filter, toggle it off by setting to most-recent default
      setSelectedFilter('most-recent');
    } else {
      // Otherwise select the new filter
      setSelectedFilter(filterKey);
    }
  };

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
  }, [processedData, selectedFilter]);

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
        <ProjectCategories
          processedData={processedData}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          searchInputRef={searchInputRef}
          handleClearSearch={handleClearSearch}
          handleFilterToggle={handleFilterToggle}
          showAllTags={showAllTags}
          setShowAllTags={setShowAllTags}
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

function ProjectCategories({
  processedData,
  searchTerm,
  setSearchTerm,
  selectedFilter,
  selectedDateRange,
  setSelectedDateRange,
  searchInputRef,
  handleClearSearch,
  handleFilterToggle,
  showAllTags,
  setShowAllTags,
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
  showAllTags: boolean;
  setShowAllTags: (show: boolean) => void;
  filtersRef: RefObject<HTMLDivElement>;
  projectsRef: RefObject<HTMLDivElement>;
  scrollToProjects: () => void;
  scrollToFilters: () => void;
  isFilterLoading: boolean;
}) {
  const filteredProjectCount = processedData.categories.reduce(
    (total, category) =>
      total +
      category.subCategories.reduce(
        (catTotal, subCategory) => catTotal + subCategory.projects.length,
        0
      ),
    0
  );

  const totalProjects = processedData.stats.totalProjects;

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
          <div className="filterGroup">
            <div className="filterButtons">
              {processedData.dateOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={
                    searchTerm
                      ? undefined
                      : () => {
                          setSelectedDateRange(option.key);
                          scrollToProjects();
                        }
                  }
                  disabled={!!searchTerm}
                  className={`filterButton ${
                    searchTerm
                      ? 'disabled'
                      : selectedDateRange === option.key
                        ? 'active'
                        : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filterGroup">
            <div className="filterButtons">
              <span className="filterGroupTitle">Categories:</span>
              {processedData.categoryOptions.map((option) => {
                const hasSearchResults =
                  searchTerm &&
                  processedData.categories.some(
                    (cat) =>
                      cat.category === option.key.toLowerCase() ||
                      option.key === 'all'
                  );

                const { searchResultCount, totalCategoryProjects } = searchTerm
                  ? calculateCategoryResults(
                      processedData,
                      option,
                      totalProjects
                    )
                  : { searchResultCount: 0, totalCategoryProjects: 0 };

                const isActive = searchTerm
                  ? hasSearchResults
                  : selectedFilter === option.key ||
                    selectedFilter.startsWith(option.key + '-') ||
                    (selectedFilter.startsWith('category-') && 
                     selectedFilter.replace('category-', '').toLowerCase() === option.key.toLowerCase());

                return (
                  <FilterButton
                    key={option.key}
                    option={option}
                    isSelected={isActive}
                    isDisabled={!!searchTerm}
                    isLoading={isFilterLoading}
                    hasSearchResults={hasSearchResults}
                    searchResultCount={searchResultCount}
                    totalCount={totalCategoryProjects}
                    onClick={handleFilterToggle}
                    searchTerm={searchTerm}
                  />
                );
              })}
            </div>
          </div>

          <div className="filterGroup">
            <div className="filterButtons">
              <span className="filterGroupTitle">Technologies:</span>
              {processedData.technologyOptions.map((option) => {
                const hasSearchResults =
                  searchTerm &&
                  processedData.categories.some((cat) =>
                    cat.subCategories.some(
                      (sub) =>
                        option.key.endsWith(`-${sub.name}`) ||
                        option.key === 'all'
                    )
                  );

                const { searchResultCount, totalTechnologyProjects } =
                  searchTerm
                    ? calculateTechnologyResults(
                        processedData,
                        option,
                        totalProjects
                      )
                    : { searchResultCount: 0, totalTechnologyProjects: 0 };

                const isActive = searchTerm
                  ? hasSearchResults
                  : selectedFilter === option.key ||
                    (option.category && selectedFilter === option.category);

                return (
                  <FilterButton
                    key={option.key}
                    option={option}
                    isSelected={isActive}
                    isDisabled={!!searchTerm}
                    isLoading={isFilterLoading}
                    hasSearchResults={hasSearchResults}
                    searchResultCount={searchResultCount}
                    totalCount={totalTechnologyProjects}
                    onClick={handleFilterToggle}
                    searchTerm={searchTerm}
                  />
                );
              })}
            </div>
          </div>

          <div className="filterGroup">
            <div className="filterButtons">
              <span className="filterGroupTitle">Tags:</span>
              {(() => {
                // Separate "All Tags" from individual tag options
                const allTagsOption = processedData.tagOptions.find(
                  (option) => option.key === 'all-tags'
                );
                const individualTags = processedData.tagOptions.filter(
                  (option) => option.key !== 'all-tags'
                );

                // Determine how many tags to show
                const tagsToShow = showAllTags
                  ? individualTags
                  : individualTags.slice(0, 10);
                const hasMoreTags = individualTags.length > 10;

                return (
                  <>
                    {/* Show "All Tags" option first if it exists */}
                    {allTagsOption && (
                      <button
                        key={allTagsOption.key}
                        onClick={
                          searchTerm
                            ? undefined
                            : () => handleFilterToggle(allTagsOption.key)
                        }
                        disabled={!!searchTerm}
                        className={`filterButton ${
                          searchTerm
                            ? 'disabled'
                            : selectedFilter === allTagsOption.key
                              ? 'active'
                              : ''
                        }`}
                        data-category="tag"
                      >
                        {(() => {
                          if (searchTerm) {
                            // Calculate total tagged projects in search results
                            const taggedProjectsCount =
                              processedData.categories.reduce(
                                (total, cat) =>
                                  total +
                                  cat.subCategories.reduce(
                                    (subTotal, sub) =>
                                      subTotal +
                                      sub.projects.filter(
                                        (project) =>
                                          project.tags &&
                                          project.tags.length > 0
                                      ).length,
                                    0
                                  ),
                                0
                              );
                            if (taggedProjectsCount > 0) {
                              // Extract total from original label
                              const labelMatch =
                                allTagsOption.label.match(/\((\d+)\)$/);
                              const totalTaggedProjects = labelMatch
                                ? parseInt(labelMatch[1])
                                : taggedProjectsCount;
                              return `${allTagsOption.label.replace(/\s*\(\d+\)$/, '')} (${taggedProjectsCount} of ${totalTaggedProjects})`;
                            }
                          }
                          return allTagsOption.label;
                        })()}
                      </button>
                    )}

                    {/* Show individual tag options */}
                    {tagsToShow.map((option) => {
                      const hasSearchResults =
                        searchTerm &&
                        processedData.categories.some((cat) =>
                          cat.subCategories.some((sub) =>
                            sub.projects.some(
                              (project) =>
                                project.tags &&
                                project.tags.some(
                                  (tag) =>
                                    option.key ===
                                      `tag-${tag.toLowerCase().replace(/\s+/g, '-')}` ||
                                    option.key === 'all-tags'
                                )
                            )
                          )
                        );

                      // Calculate project count for this specific tag during search
                      let searchResultCount = 0;
                      if (searchTerm && hasSearchResults) {
                        const tagKey = option.key.substring(4); // Remove 'tag-' prefix

                        processedData.categories.forEach((cat) => {
                          cat.subCategories.forEach((sub) => {
                            sub.projects.forEach((project) => {
                              if (project.tags) {
                                project.tags.forEach((tag) => {
                                  const normalizedTag = tag
                                    .toLowerCase()
                                    .replace(/\s+/g, '-');
                                  if (normalizedTag === tagKey) {
                                    searchResultCount++;
                                  }
                                });
                              }
                            });
                          });
                        });
                      }

                      const isActive = searchTerm
                        ? hasSearchResults
                        : selectedFilter === option.key;

                      // Update label to show search results count in "X of Y" format
                      const displayLabel =
                        searchTerm && hasSearchResults
                          ? (() => {
                              // Extract the tag name and original count from the label
                              const tagName = option.label.split(' (')[0];
                              const labelMatch =
                                option.label.match(/\((\d+)\)$/);
                              const totalTagProjects = labelMatch
                                ? parseInt(labelMatch[1])
                                : searchResultCount;
                              return `${tagName} (${searchResultCount} of ${totalTagProjects})`;
                            })()
                          : option.label;

                      return (
                        <button
                          key={option.key}
                          onClick={
                            searchTerm
                              ? undefined
                              : () => handleFilterToggle(option.key)
                          }
                          disabled={!!searchTerm}
                          className={`filterButton ${
                            searchTerm
                              ? hasSearchResults
                                ? 'active disabled'
                                : 'disabled'
                              : isActive
                                ? 'active'
                                : ''
                          }`}
                          data-category="tag"
                        >
                          {displayLabel}
                        </button>
                      );
                    })}

                    {/* Show "more" button if there are more tags */}
                    {hasMoreTags && !searchTerm && (
                      <button
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="filterButton showMore"
                        data-category="tag"
                      >
                        {showAllTags
                          ? `Show Less`
                          : `Show More (${individualTags.length - 10} more)`}
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
          <div ref={projectsRef}></div>
        </div>

        {searchTerm && (
          <div className="projectSummary">
            <p className="summaryText">
              Showing {filteredProjectCount} of {totalProjects} projects
            </p>
          </div>
        )}

        <div>
          {processedData.categories.length === 0 ? (
            <div className="noResults">
              <p>
                No Projects Found{searchTerm ? ` matching "${searchTerm}"` : ''}
              </p>
            </div>
          ) : (
            (() => {
              // Calculate if there are any search results
              const hasSearchResults = processedData.categories.some((cat) =>
                cat.subCategories.some((sub) => sub.projects.length > 0)
              );
              return (
                <ProjectDisplay
                  categories={processedData.categories}
                  searchTerm={searchTerm}
                  hasSearchResults={hasSearchResults}
                  selectedFilter={selectedFilter}
                  handleFilterToggle={handleFilterToggle}
                  scrollToFilters={scrollToFilters}
                />
              );
            })()
          )}
        </div>
      </div>
    </section>
  );
}

function ProjectDisplay({
  categories,
  searchTerm,
  hasSearchResults,
  selectedFilter,
  handleFilterToggle,
  scrollToFilters
}: {
  categories: ProcessedCategory[];
  searchTerm: string;
  hasSearchResults: boolean;
  handleFilterToggle: (tag: string) => void;
  selectedFilter: string | undefined;
  scrollToFilters: () => void;
}) {
  // Flatten all projects from all categories and subcategories
  const allProjects = categories.flatMap((cat) =>
    cat.subCategories.flatMap((sub) => sub.projects)
  );

  // Sort projects by lastModified date (newest first), handle empty dates
  const sortedProjects = [...allProjects].sort((a, b) => {
    const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
    const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
    return dateB - dateA;
  });

  // Calculate relative time helper function
  const getRelativeTime = (date: string) => {
    const now = new Date();
    const projectDate = new Date(date);
    const diffInDays = Math.floor(
      (now.getTime() - projectDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <>
      <div className="projectGrid">
        {sortedProjects.map((project, projectIdx) => {
          const isRecent =
            project.lastModified &&
            new Date().getTime() - new Date(project.lastModified).getTime() <
              6 * 30 * 24 * 60 * 60 * 1000; // 6 months

          return (
            <div key={projectIdx} className="projectCard">
              <div className="projectCardHeader">
                <h3 className="projectCardTitle">{project.title}</h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="projectLinkIcon"
                    title="View on GitHub"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
              </div>

              <p className="projectSummary">{project.summary}</p>

              {project.tags && project.tags.length > 0 && (
                <div className="projectTags">
                  {project.tags.map((tag) => {
                    const normalizedTagKey = `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`;
                    const isActive = searchTerm ? hasSearchResults : selectedFilter === normalizedTagKey;

                    return (
                      <span key={normalizedTagKey} className="">
                        <button
                          onClick={searchTerm ? undefined : () => handleFilterToggle(normalizedTagKey)}
                          disabled={!!searchTerm}
                          className={`filterButton ${
                            searchTerm ? (hasSearchResults ? 'active disabled' : 'disabled') : (isActive ? 'active' : '')
                          }`}
                          aria-label={`Filter by ${tag}`}
                          title={`Filter by ${tag}`}
                          data-category="tag"
                        >
                          {tag}
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="projectFooter">
                {project.lastModified && (
                  <span className="projectDate">
                    {getRelativeTime(project.lastModified)}
                  </span>
                )}
                {isRecent && <span className="recentBadge">Recent</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Back to filters button */}
      <div className="backToFilters">
        <button
          onClick={scrollToFilters}
          className="backToFiltersButton"
          aria-label="Back to filters"
        >
          ↑ Back to Filters
        </button>
      </div>
    </>
  );
}
