import React, { useState } from 'react';
import ProjectsManager from './ProjectsManager';
import { useAdminProjects } from './hooks/useAdminProjects';
import { DataLoader } from '../../services/dataLoader';
import { Features } from '../../config/FeaturesConfig/models';
import { DEFAULT_PROJECTS_DATA } from './constants';

export default function ProjectsAdmin(): React.ReactNode {
  const { token, setToken, putProject, bulkDelete, refresh, apiBase, setApiBase } = useAdminProjects();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showHints, setShowHints] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try { const v = localStorage.getItem('projects.admin.hints'); return v ? v === 'true' : true; } catch { return true; }
  });

  const onRefreshStore = async () => {
    const loader = new DataLoader();
    await loader.loadData('projects', Features.ProjectsPage, DEFAULT_PROJECTS_DATA);
    await refresh();
  };

  return (
    <>
      <div className="admin-list-header" style={{ marginBottom: '0.5rem' }}>
        <div className="admin-list-title" />
        <button
          type="button"
          className="button button--sm admin-gear"
          aria-label="Settings"
          title="Settings"
          onClick={() => setSettingsOpen(true)}
        >
          ⚙
        </button>
      </div>
      <ProjectsManager
        isAdmin
        adminToken={token}
        adminApiBase={apiBase}
        onSaveProject={putProject}
        onBulkDelete={bulkDelete}
        onRefresh={onRefreshStore}
      />

      {settingsOpen && (
        <div className="admin-modal" onClick={() => setSettingsOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Settings</h3>
            <div className="admin-row">
              <label className="admin-field">
                <div>API Base</div>
                <input
                  className="admin-input"
                  type="text"
                  value={apiBase}
                  onChange={(e) => setApiBase(e.target.value)}
                  placeholder="http://localhost:4000/api"
                />
              </label>
              <label className="admin-field">
                <div>Admin Token</div>
                <input
                  className="admin-input"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="x-admin-token"
                />
              </label>
              <label className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div>Show Keyboard Hints</div>
                <input
                  type="checkbox"
                  checked={showHints}
                  onChange={(e) => setShowHints(e.target.checked)}
                  aria-label="Toggle keyboard hints"
                />
              </label>
            </div>
            <div className="admin-actions" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="button button--sm" onClick={() => setSettingsOpen(false)}>Close</button>
              <button
                className="button button--sm button--primary"
                onClick={() => {
                  setSettingsOpen(false);
                  try {
                    localStorage.setItem('projects.admin.hints', String(showHints));
                    window.dispatchEvent(new Event('projects.admin.hints.change'));
                  } catch {
                    // ignore storage failures
                    void 0;
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
