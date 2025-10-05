import React, { useState, useEffect } from 'react';
// import { useAuth } from '../Auth/AuthProvider';
// import { useAutoSave } from './useAutoSave'; // Temporarily disabled
import { useProjectValidation } from './useProjectValidation';
import { ActivityLogPanel } from './ActivityLogPanel';
import { useAdminProjects } from './hooks/useAdminProjects';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch';

/**
 * Modal for advanced admin editing of projects
 */
export const AdminTabsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  projectId: string;
  isAdmin?: boolean;
}> = ({ open, onClose, projectId, isAdmin = false }) => {
  const { putProject } = useAdminProjects();
  const { authenticatedFetch } = useAuthenticatedFetch();

  const [project, setProject] = useState<any>({
    id: projectId,
    title: '',
    summary: '',
    link: '',
    tags: []
  });
  const [projectMeta, setProjectMeta] = useState<{
    category: string;
    subCategory: string;
    slug: string;
  } | null>(null);
  const [allProjects] = useState<any[]>([]); // Should be fetched from context/store
  const [activityEvents, setActivityEvents] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Real-time validation
  const errors = useProjectValidation(project, allProjects);

  // Fetch project data when modal opens
  useEffect(() => {
    if (!open || !projectId) return;

    const fetchProject = async () => {
      try {
        // Fetch from the flat projects API to get the full project data including metadata
        const response = await fetch(
          'http://localhost:4000/api/v1/projects/raw'
        );
        if (response.ok) {
          const allProjects = await response.json();
          const foundProject = allProjects.find(
            (p: any) => p.slug === projectId
          );
          if (foundProject) {
            setProject({
              title: foundProject.title || '',
              summary: foundProject.summary || '',
              link: foundProject.link || '',
              tags: foundProject.tags || []
            });
            setProjectMeta({
              category: foundProject.category,
              subCategory: foundProject.subCategory,
              slug: foundProject.slug
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch project data:', error);
      }
    };

    fetchProject();
  }, [open, projectId]);

  // Save project function
  const handleSave = async () => {
    if (!projectMeta) {
      console.error('Cannot save: missing project metadata');
      return;
    }

    setSaving(true);
    try {
      await putProject({
        category: projectMeta.category,
        subCategory: projectMeta.subCategory,
        slug: projectMeta.slug,
        project: {
          title: project.title,
          summary: project.summary,
          link: project.link,
          tags: project.tags,
          lastModified: new Date().toISOString()
        }
      });

      console.log('Project saved successfully');
      onClose(); // Close modal on successful save
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setSaving(false);
    }
  };

  // Auto-save draft to backend (temporarily disabled to prevent infinite calls)
  // const handleAutoSave = useCallback(async (draft: any) => {
  //   const jwtToken = localStorage.getItem('accessToken');
  //   if (!jwtToken) return; // Don't auto-save if not authenticated
  //
  //   try {
  //     console.log('Auto-save disabled temporarily'); // Debug log
  //     // TODO: Re-enable after fixing infinite loop
  //   } catch (error) {
  //     console.error('Failed to auto-save draft:', error);
  //   }
  // }, []);

  // Temporarily disable auto-save to prevent infinite calls
  // useAutoSave(project, handleAutoSave);

  useEffect(() => {
    // Re-enable activity log fetch with better error handling
    const fetchActivityLog = async () => {
      try {
        console.log('Fetching activity log...');
        const response = await authenticatedFetch(
          'http://localhost:4000/api/v1/activity-log'
        );

        if (!response.ok) {
          console.warn(
            `Activity log fetch failed: ${response.status} ${response.statusText}`
          );
          setActivityEvents([]);
          return;
        }

        const data = await response.json();
        setActivityEvents(Array.isArray(data) ? data : []);
        console.log(
          'Activity log fetched successfully:',
          data.length,
          'events'
        );
      } catch (error) {
        console.error('Failed to fetch activity log:', error);
        setActivityEvents([]);
      }
    };

    if (isAdmin && open) {
      fetchActivityLog();
    }
  }, [isAdmin, open, authenticatedFetch]);

  if (!isAdmin || !open) return null;

  return (
    <div className="admin-tabs-modal">
      <div className="modal-content">
        <h3>Edit Project (ID: {projectId})</h3>
        {/* Validation errors */}
        {errors.length > 0 && (
          <div className="validation-errors">
            <ul>
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Project edit form */}
        <div className="admin-form">
          <div className="admin-field">
            <label>Title:</label>
            <input
              type="text"
              value={project.title}
              onChange={(e) =>
                setProject({ ...project, title: e.target.value })
              }
              placeholder="Project title"
              className="admin-input"
            />
          </div>

          <div className="admin-field">
            <label>Summary:</label>
            <textarea
              value={project.summary}
              onChange={(e) =>
                setProject({ ...project, summary: e.target.value })
              }
              placeholder="Project summary"
              className="admin-textarea"
              rows={8}
            />
          </div>

          <div className="admin-field">
            <label>Tags:</label>
            <input
              type="text"
              value={project.tags ? project.tags.join(', ') : ''}
              onChange={(e) => {
                const tagString = e.target.value;
                const tags = tagString
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter((tag) => tag);
                setProject({ ...project, tags });
              }}
              placeholder="Enter tags separated by commas"
              className="admin-input"
            />
          </div>

          <div className="admin-field">
            <label>Link:</label>
            <input
              type="url"
              value={project.link}
              onChange={(e) => setProject({ ...project, link: e.target.value })}
              placeholder="https://..."
              className="admin-input"
            />
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="button button--primary"
              onClick={handleSave}
              disabled={saving || errors.length > 0}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
        {/* Activity log panel */}
        <ActivityLogPanel events={activityEvents} />
      </div>
    </div>
  );
};
