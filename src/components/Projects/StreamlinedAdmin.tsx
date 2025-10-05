import React, { useState, useCallback, useMemo } from 'react';
import { AdminProjectsTable } from './AdminProjectsTable';
import { ProjectForm } from './ProjectForm';
import {
  ProcessedProjectData,
  SaveProjectInput
} from '../../../shared/types/project-types';
import './AdminProjectsTable.css';
import './ProjectForm.css';

interface StreamlinedAdminProps {
  processedData: ProcessedProjectData;
  onSaveProject?: (input: SaveProjectInput, token?: string) => Promise<void>;
  onBulkDelete?: (
    targets: Array<{ category: string; subCategory: string; slug: string }>,
    token?: string
  ) => Promise<void>;
  adminToken?: string;
  onRefresh?: () => Promise<void>;
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
 * Streamlined admin interface with table view and enhanced form
 * Replaces the card-based admin with a more efficient workflow
 */
export function StreamlinedAdmin({
  processedData,
  onSaveProject,
  onBulkDelete,
  adminToken,
  onRefresh
}: StreamlinedAdminProps): React.ReactNode {
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set()
  );
  const [activeView, setActiveView] = useState<'list' | 'form'>('list');
  const [editingProject, setEditingProject] = useState<FlatProject | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Flatten projects from processed data
  const flatProjects: FlatProject[] = useMemo(() => {
    const projects: FlatProject[] = [];
    processedData.categories.forEach((cat) => {
      cat.subCategories.forEach((sub) => {
        sub.projects.forEach((project) => {
          const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          projects.push({
            id: `${cat.category}||${sub.name}||${slug}`,
            category: cat.category,
            subCategory: sub.name,
            slug,
            title: project.title,
            link: project.link,
            lastModified:
              typeof project.lastModified === 'string'
                ? project.lastModified
                : project.lastModified?.toISOString()?.split('T')[0],
            summary: project.summary,
            tags: project.tags || []
          });
        });
      });
    });
    return projects;
  }, [processedData]);

  // Extract all projects for smart selector options
  const allProjectsData = useMemo(() => {
    return flatProjects.map((p) => ({
      category: p.category,
      subCategory: p.subCategory,
      tags: p.tags
    }));
  }, [flatProjects]);

  const showStatus = useCallback(
    (type: 'success' | 'error' | 'info', message: string) => {
      setStatus({ type, message });
      setTimeout(() => setStatus(null), 4000);
    },
    []
  );

  const handleEdit = useCallback((project: FlatProject) => {
    setEditingProject(project);
    setActiveView('form');
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingProject(null);
    setActiveView('form');
  }, []);

  const handleCancel = useCallback(() => {
    setEditingProject(null);
    setActiveView('list');
  }, []);

  const handleSave = useCallback(
    async (input: SaveProjectInput) => {
      if (!onSaveProject) return;

      setIsLoading(true);
      try {
        await onSaveProject(input, adminToken);
        showStatus(
          'success',
          `Project "${input.project.title}" saved successfully`
        );
        setActiveView('list');
        setEditingProject(null);
        await onRefresh?.();
      } catch (error: any) {
        showStatus('error', error?.message || 'Failed to save project');
      } finally {
        setIsLoading(false);
      }
    },
    [onSaveProject, adminToken, onRefresh, showStatus]
  );

  const handleDelete = useCallback(
    async (project: FlatProject) => {
      if (!onBulkDelete) return;

      const confirmed = window.confirm(
        `Are you sure you want to delete "${project.title}"?`
      );
      if (!confirmed) return;

      setIsLoading(true);
      try {
        await onBulkDelete(
          [
            {
              category: project.category,
              subCategory: project.subCategory,
              slug: project.slug
            }
          ],
          adminToken
        );

        showStatus(
          'success',
          `Project "${project.title}" deleted successfully`
        );

        // Remove from selection if it was selected
        setSelectedProjects((prev) => {
          const newSelection = new Set(prev);
          newSelection.delete(project.id);
          return newSelection;
        });

        await onRefresh?.();
      } catch (error: any) {
        showStatus('error', error?.message || 'Failed to delete project');
      } finally {
        setIsLoading(false);
      }
    },
    [onBulkDelete, adminToken, onRefresh, showStatus]
  );

  const handleBulkDelete = useCallback(
    async (projects: FlatProject[]) => {
      if (!onBulkDelete || projects.length === 0) return;

      const confirmed = window.confirm(
        `Are you sure you want to delete ${projects.length} selected project${projects.length > 1 ? 's' : ''}?`
      );
      if (!confirmed) return;

      setIsLoading(true);
      try {
        const targets = projects.map((p) => ({
          category: p.category,
          subCategory: p.subCategory,
          slug: p.slug
        }));

        await onBulkDelete(targets, adminToken);
        showStatus(
          'success',
          `${projects.length} project${projects.length > 1 ? 's' : ''} deleted successfully`
        );
        setSelectedProjects(new Set());
        await onRefresh?.();
      } catch (error: any) {
        showStatus('error', error?.message || 'Failed to delete projects');
      } finally {
        setIsLoading(false);
      }
    },
    [onBulkDelete, adminToken, onRefresh, showStatus]
  );

  return (
    <div className="streamlined-admin">
      {/* Status Messages */}
      {status && (
        <div className={`admin-status admin-status--${status.type}`}>
          {status.message}
          <button
            className="admin-status-close"
            onClick={() => setStatus(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="streamlined-admin-header">
        <div className="admin-header-content">
          <h2>
            {activeView === 'list'
              ? 'Projects Management'
              : editingProject
                ? 'Edit Project'
                : 'Add New Project'}
          </h2>
          <div className="admin-header-stats">
            {activeView === 'list' && (
              <>
                <span className="stat-item">
                  <strong>{flatProjects.length}</strong> Total Projects
                </span>
                <span className="stat-item">
                  <strong>{selectedProjects.size}</strong> Selected
                </span>
              </>
            )}
          </div>
        </div>

        <div className="admin-header-actions">
          {activeView === 'list' ? (
            <button
              className="button button--primary"
              onClick={handleAddNew}
              disabled={isLoading}
            >
              + Add New Project
            </button>
          ) : (
            <button
              className="button button--secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              ← Back to List
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="streamlined-admin-content">
        {activeView === 'list' ? (
          <AdminProjectsTable
            projects={flatProjects}
            selectedProjects={selectedProjects}
            onSelectionChange={setSelectedProjects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
          />
        ) : (
          <ProjectForm
            project={editingProject || undefined}
            allProjects={allProjectsData}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="admin-loading-overlay">
          <div className="admin-loading-spinner">
            <div className="spinner"></div>
            <p>Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}
