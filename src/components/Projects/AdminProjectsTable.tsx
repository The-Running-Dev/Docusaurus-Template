import React, { useState, useMemo, useCallback } from 'react';

interface AdminProjectsTableProps {
  projects: FlatProject[];
  selectedProjects: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onEdit: (project: FlatProject) => void;
  onDelete: (project: FlatProject) => void;
  onBulkDelete: (projects: FlatProject[]) => void;
}

interface FlatProject {
  id: string;
  category: string;
  subCategory: string;
  slug: string;
  title: string;
  link?: string;
  lastModified?: string;
  summary: string;
  tags: string[];
}

/**
 * Table-based admin interface for managing projects
 * Replaces the card-based layout with a more efficient table view
 */
export function AdminProjectsTable({
  projects,
  selectedProjects,
  onSelectionChange,
  onEdit,
  onDelete,
  onBulkDelete
}: AdminProjectsTableProps): React.ReactNode {
  const [sortBy, setSortBy] = useState<keyof FlatProject>('lastModified');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Flatten and sort projects
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];

      // Special handling for dates
      if (sortBy === 'lastModified') {
        aVal = aVal ? new Date(aVal as string).getTime() : 0;
        bVal = bVal ? new Date(bVal as string).getTime() : 0;
      }

      // Special handling for arrays (tags)
      if (Array.isArray(aVal)) aVal = aVal.length;
      if (Array.isArray(bVal)) bVal = bVal.length;

      // Convert to strings for comparison
      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();

      const comparison = aStr.localeCompare(bStr);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [projects, sortBy, sortDirection]);

  const handleSort = useCallback(
    (column: keyof FlatProject) => {
      if (sortBy === column) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(column);
        setSortDirection('desc');
      }
    },
    [sortBy]
  );

  const handleSelectAll = useCallback(() => {
    if (selectedProjects.size === projects.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(projects.map((p) => p.id)));
    }
  }, [projects, selectedProjects, onSelectionChange]);

  const handleRowSelect = useCallback(
    (projectId: string) => {
      const newSelection = new Set(selectedProjects);
      if (newSelection.has(projectId)) {
        newSelection.delete(projectId);
      } else {
        newSelection.add(projectId);
      }
      onSelectionChange(newSelection);
    },
    [selectedProjects, onSelectionChange]
  );

  const handleBulkDeleteSelected = useCallback(() => {
    const projectsToDelete = projects.filter((p) => selectedProjects.has(p.id));
    if (projectsToDelete.length > 0) {
      onBulkDelete(projectsToDelete);
    }
  }, [projects, selectedProjects, onBulkDelete]);

  const SortableHeader = ({
    column,
    children
  }: {
    column: keyof FlatProject;
    children: React.ReactNode;
  }) => (
    <th
      className="admin-table-header sortable"
      onClick={() => handleSort(column)}
      style={{ cursor: 'pointer', userSelect: 'none' }}
    >
      {children}
      {sortBy === column && (
        <span className="sort-indicator">
          {sortDirection === 'asc' ? ' ↑' : ' ↓'}
        </span>
      )}
    </th>
  );

  return (
    <div className="admin-projects-table-container">
      {/* Bulk Actions Toolbar */}
      <div className="admin-table-toolbar">
        <div className="admin-table-stats">
          {selectedProjects.size > 0 ? (
            <span>
              {selectedProjects.size} of {projects.length} selected
            </span>
          ) : (
            <span>{projects.length} projects total</span>
          )}
        </div>
        <div className="admin-table-actions">
          {selectedProjects.size > 0 && (
            <>
              <button
                className="button button--sm button--danger"
                onClick={handleBulkDeleteSelected}
                title={`Delete ${selectedProjects.size} selected projects`}
              >
                Delete Selected ({selectedProjects.size})
              </button>
              <button
                className="button button--sm"
                onClick={() => onSelectionChange(new Set())}
                title="Clear selection"
              >
                Clear Selection
              </button>
            </>
          )}
        </div>
      </div>

      {/* Projects Table */}
      <div className="admin-table-wrapper">
        <table className="admin-projects-table">
          <thead>
            <tr>
              <th className="admin-table-header">
                <input
                  type="checkbox"
                  checked={
                    projects.length > 0 &&
                    selectedProjects.size === projects.length
                  }
                  onChange={handleSelectAll}
                  title="Select all projects"
                />
              </th>
              <SortableHeader column="title">Title</SortableHeader>
              <SortableHeader column="category">Category</SortableHeader>
              <SortableHeader column="subCategory">Subcategory</SortableHeader>
              <SortableHeader column="lastModified">Modified</SortableHeader>
              <SortableHeader column="tags">Tags</SortableHeader>
              <th className="admin-table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProjects.map((project) => (
              <tr
                key={project.id}
                className={`admin-table-row ${selectedProjects.has(project.id) ? 'selected' : ''}`}
              >
                <td className="admin-table-cell">
                  <input
                    type="checkbox"
                    checked={selectedProjects.has(project.id)}
                    onChange={() => handleRowSelect(project.id)}
                  />
                </td>
                <td className="admin-table-cell admin-table-title">
                  <div className="project-title-cell">
                    <strong
                      className="project-title-link"
                      onClick={() => onEdit(project)}
                      style={{ cursor: 'pointer' }}
                      title="Click to edit"
                    >
                      {project.title}
                    </strong>
                    {project.summary && (
                      <div className="project-summary-preview">
                        {project.summary.length > 100
                          ? `${project.summary.substring(0, 100)}...`
                          : project.summary}
                      </div>
                    )}
                  </div>
                </td>
                <td className="admin-table-cell">
                  <span className="admin-category-badge">
                    {project.category}
                  </span>
                </td>
                <td className="admin-table-cell">
                  <span className="admin-subcategory-badge">
                    {project.subCategory}
                  </span>
                </td>
                <td className="admin-table-cell">
                  {project.lastModified ? (
                    <span className="project-date">
                      {new Date(project.lastModified).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="project-date-empty">—</span>
                  )}
                </td>
                <td className="admin-table-cell">
                  <div className="project-tags-cell">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="admin-tag-mini">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span
                        className="admin-tag-more"
                        title={project.tags.slice(3).join(', ')}
                      >
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="admin-table-cell admin-table-actions">
                  <div className="admin-action-buttons">
                    <button
                      className="button button--sm"
                      onClick={() => onEdit(project)}
                      title="Edit project"
                    >
                      ✏️
                    </button>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button button--sm"
                        title="Open link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        🔗
                      </a>
                    )}
                    <button
                      className="button button--sm button--danger"
                      onClick={() => onDelete(project)}
                      title="Delete project"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {projects.length === 0 && (
        <div className="admin-table-empty">
          <p>No projects found.</p>
          <p>Use the "Add New Project" button to create your first project.</p>
        </div>
      )}
    </div>
  );
}
