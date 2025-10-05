import { type ReactNode } from 'react';
import { ProcessedCategory } from '../../../../shared/types/project-types';
import { InlineEditMode } from '../InlineEditMode';

interface ProjectGridProps {
  categories: ProcessedCategory[];
  searchTerm: string;
  activeFilter: string;
  onFilterToggle: (filter: string) => void;
  onScrollToFilters: () => void;
  isAdmin?: boolean;
  selectedProjects?: string[];
  onProjectSelect?: (projectId: string, selected: boolean) => void;
  onProjectSave?: (projectId: string, field: string, value: string) => void;
}

export default function ProjectGrid({
  categories,
  searchTerm,
  activeFilter,
  onFilterToggle,
  onScrollToFilters,
  isAdmin = false,
  selectedProjects = [],
  onProjectSelect,
  onProjectSave
}: ProjectGridProps): ReactNode {
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

    if (diffInDays < 1) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    const weeks = Math.floor(diffInDays / 7);
    if (diffInDays < 30) {
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }

    const months = Math.floor(diffInDays / 30);
    if (diffInDays < 365) {
      return months === 1 ? '1 month ago' : `${months} months ago`;
    }

    const years = Math.floor(diffInDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  };

  const hasSearchResults = sortedProjects.length > 0;

  return (
    <>
      <div className="projectGrid">
        {sortedProjects.map((project, projectIdx) => {
          const isRecent =
            project.lastModified &&
            new Date().getTime() - new Date(project.lastModified).getTime() <
              6 * 30 * 24 * 60 * 60 * 1000; // 6 months

          // Create project ID for admin functionality
          const projectId = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${projectIdx}`;
          const isSelected = selectedProjects.includes(projectId);

          return (
            <div
              key={projectIdx}
              className={`projectCard ${isAdmin && isSelected ? 'admin-selected' : ''}`}
              onClick={
                isAdmin
                  ? (e) => {
                      e.preventDefault();
                      onProjectSelect?.(projectId, !isSelected);
                    }
                  : undefined
              }
              style={{ cursor: isAdmin ? 'pointer' : 'default' }}
            >
              {/* Admin Controls Overlay */}
              {isAdmin && (
                <div className="admin-project-controls">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onProjectSelect?.(projectId, e.target.checked);
                    }}
                    className="admin-project-checkbox"
                    title="Select project"
                  />
                </div>
              )}

              <div className="projectCardHeader">
                <h3 className="projectCardTitle">
                  {isAdmin ? (
                    <InlineEditMode
                      value={project.title}
                      onSave={(newTitle) => {
                        if (onProjectSave) {
                          // Generate a unique project ID similar to how AdminProjects does it
                          const projectId = `${project.title}|${new Date(project.lastModified || Date.now()).getTime()}`;
                          onProjectSave(projectId, 'title', newTitle);
                        }
                      }}
                      field="title"
                    />
                  ) : (
                    project.title
                  )}
                </h3>
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

              <p className="projectSummary">
                {isAdmin ? (
                  <InlineEditMode
                    value={project.summary}
                    onSave={(newSummary) => {
                      if (onProjectSave) {
                        // Generate a unique project ID similar to how AdminProjects does it
                        const projectId = `${project.title}|${new Date(project.lastModified || Date.now()).getTime()}`;
                        onProjectSave(projectId, 'summary', newSummary);
                      }
                    }}
                    field="summary"
                  />
                ) : (
                  project.summary
                )}
              </p>

              {project.tags && project.tags.length > 0 && (
                <div className="projectTags">
                  {project.tags.map((tag) => {
                    const normalizedTagKey = `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`;
                    const isActive = searchTerm
                      ? hasSearchResults
                      : activeFilter === normalizedTagKey;

                    return (
                      <span key={normalizedTagKey} className="">
                        <button
                          onClick={
                            searchTerm
                              ? undefined
                              : () => onFilterToggle(normalizedTagKey)
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
                    {getRelativeTime(
                      typeof project.lastModified === 'string'
                        ? project.lastModified
                        : project.lastModified.toISOString()
                    )}
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
          onClick={onScrollToFilters}
          className="backToFiltersButton"
          aria-label="Back to filters"
        >
          ↑ Back to Filters
        </button>
      </div>
    </>
  );
}
