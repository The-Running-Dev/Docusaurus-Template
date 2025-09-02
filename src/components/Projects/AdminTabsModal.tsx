import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { useAutoSave } from './useAutoSave';
import { useProjectValidation } from './useProjectValidation';
import { ActivityLogPanel } from './ActivityLogPanel';

/**
 * Modal for advanced admin editing of projects
 */
export const AdminTabsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  projectId: string;
}> = ({ open, onClose, projectId }) => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.roles?.includes('admin');

  const [project, setProject] = useState<any>({
    id: projectId,
    title: '',
    summary: '',
    link: '',
    tags: []
  });
  const [allProjects, setAllProjects] = useState<any[]>([]); // Should be fetched from context/store
  const [activityEvents, setActivityEvents] = useState<any[]>([]);

  // Real-time validation
  const errors = useProjectValidation(project, allProjects);

  // Auto-save draft to backend
  useAutoSave(project, async (draft) => {
    await fetch('/api/v1/projects/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft)
    });
    setActivityEvents((evts) => [
      ...evts,
      { type: 'auto-save', message: 'Draft auto-saved', timestamp: Date.now() }
    ]);
  });

  useEffect(() => {
    // Fetch activity log from backend
    fetch('/api/v1/activity-log')
      .then((res) => res.json())
      .then(setActivityEvents);
  }, []);

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
        {/* Project edit form (simplified) */}
        <input
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          placeholder="Title"
        />
        <input
          value={project.summary}
          onChange={(e) => setProject({ ...project, summary: e.target.value })}
          placeholder="Summary"
        />
        <input
          value={project.link}
          onChange={(e) => setProject({ ...project, link: e.target.value })}
          placeholder="Link"
        />
        <button onClick={onClose}>Close</button>
        {/* Activity log panel */}
        <ActivityLogPanel events={activityEvents} />
      </div>
    </div>
  );
};
