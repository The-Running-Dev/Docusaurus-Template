import type { ReactNode, RefObject } from 'react';
import { useState, useEffect, useCallback } from 'react';

import DebugInfo from '../DebugInfo';
import Loading from '../Loading';
import { useFeaturesConfig } from '../../config';
import { useProjects } from '../../hooks/useProjects';
import { ProcessedProjectData } from '../../../shared/types/project-types';
import { useProcessor, useUrlFilter, useSearch, useScrollRefs } from './hooks';
import { FilterErrorBoundary } from './components/FilterErrorBoundary';
import { useAuth } from '../Auth/AuthProvider';
import { AdminOverlay } from './AdminOverlay';
import { BulkActionsToolbar } from './BulkActionsToolbar';
import { AdminTabsModal } from './AdminTabsModal';
import { LoginModal } from '../Auth/LoginModal';
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
import '../../pages/admin/projects.css';

/**
 * Enhanced Projects component with integrated admin functionality
 * This component works with static or http data and provides
 * all filtering/search functionality plus admin controls when authenticated
 */
export default function Projects(): ReactNode {
  const features = useFeaturesConfig();
  const { data, loading, error } = useProjects();
  const { user, isAuthenticated, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Check if user is admin
  const isAdmin = isAuthenticated && user?.roles?.includes('admin');

  if (!features.projectsPage) {
    return null;
  }

  if (loading) {
    return (
      <Loading
        message={
          isAdmin ? '🔄 Loading Projects (Admin)...' : '🔄 Loading Projects...'
        }
        secondaryMessage={
          isAdmin
            ? 'Fetching + preparing admin UI...'
            : 'Fetching Data and Filtering...'
        }
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
      {isAdmin ? (
        <AdminOverlay>
          <ProjectsContent rawData={data} isAdmin={isAdmin} />
        </AdminOverlay>
      ) : (
        <ProjectsContent rawData={data} isAdmin={false} />
      )}

      {/* Floating Admin Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000
        }}
      >
        {isAuthenticated ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {isAdmin && (
              <div
                style={{
                  background: 'var(--ifm-color-primary)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}
              >
                Admin Mode ✨
              </div>
            )}
            <button
              onClick={() => logout()}
              style={{
                background: 'var(--ifm-color-emphasis-700)',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              Logout ({user?.username})
            </button>
          </div>
        ) : (
          <button
            onClick={() => setLoginModalOpen(true)}
            style={{
              background: 'var(--ifm-color-primary)',
              color: 'white',
              border: 'none',
              padding: '12px 18px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            🔐 Admin Login
          </button>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </FilterErrorBoundary>
  );
}

/**
 * Inner component that handles all the projects logic
 * Separated to keep the main component wrapper clean
 */
function ProjectsContent({
  rawData,
  isAdmin
}: {
  rawData: any[];
  isAdmin: boolean;
}): ReactNode {
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

  // Admin state management
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

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

      {/* Admin Controls */}
      {isAdmin && (
        <BulkActionsToolbar
          selected={selectedProjects}
          onAction={(action) => {
            switch (action) {
              case 'delete':
                // Handle bulk delete
                console.log('Bulk delete:', selectedProjects);
                setSelectedProjects([]);
                break;
              case 'move':
                // Handle bulk move
                console.log('Bulk move:', selectedProjects);
                break;
              case 'tag':
                // Handle bulk tag change
                console.log('Bulk tag:', selectedProjects);
                break;
            }
          }}
        />
      )}

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
          isAdmin={isAdmin}
          selectedProjects={selectedProjects}
          onProjectSelect={(projectId, selected) => {
            if (selected) {
              setSelectedProjects([...selectedProjects, projectId]);
            } else {
              setSelectedProjects(
                selectedProjects.filter((id) => id !== projectId)
              );
            }
          }}
          onProjectEdit={(projectId) => {
            setEditingProjectId(projectId);
            setAdminModalOpen(true);
          }}
        />
      </main>

      {/* Admin Modal */}
      {isAdmin && adminModalOpen && editingProjectId && (
        <AdminTabsModal
          open={adminModalOpen}
          onClose={() => {
            setAdminModalOpen(false);
            setEditingProjectId(null);
          }}
          projectId={editingProjectId}
        />
      )}

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
  isFilterLoading,
  isAdmin = false,
  selectedProjects = [],
  onProjectSelect,
  onProjectEdit
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
  isAdmin?: boolean;
  selectedProjects?: string[];
  onProjectSelect?: (projectId: string, selected: boolean) => void;
  onProjectEdit?: (projectId: string) => void;
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
          isAdmin={isAdmin}
          selectedProjects={selectedProjects}
          onProjectSelect={onProjectSelect}
          onProjectEdit={onProjectEdit}
        />
      </div>
    </section>
  );
}
