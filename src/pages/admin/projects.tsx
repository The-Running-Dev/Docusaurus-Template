import React from 'react';
import Layout from '@theme/Layout';
import './projects.css';
import { ProjectsAdmin } from '../../components/Projects';
import { AuthDebug } from '../../components/Debug/AuthDebug';

export default function AdminProjectsPage(): React.JSX.Element {
  return (
    <Layout title="Admin • Projects" description="Edit projects data">
      <div className="container margin-top--lg admin-wrap">
        <header className="admin-header">
          <h1 className="admin-title">Admin • Projects</h1>
          <p className="admin-subtitle">
            Create, edit and manage project entries
          </p>
          <div className="alert alert--info" style={{ marginBottom: '1rem' }}>
            <strong>Note:</strong> Admin functionality has been consolidated
            into the main projects component. All admin controls (editing, bulk
            actions, settings) are now integrated and show when admin mode is
            enabled.
          </div>
        </header>
        <AuthDebug />
        <ProjectsAdmin />
      </div>
    </Layout>
  );
}
