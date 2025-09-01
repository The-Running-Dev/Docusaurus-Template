import React from 'react';
import Layout from '@theme/Layout';
import './projects.css';
import { ProjectsAdmin } from '../../components/Projects';

export default function AdminProjectsPage(): React.JSX.Element {
  return (
    <Layout title="Admin • Projects" description="Edit projects data">
      <div className="container margin-top--lg admin-wrap">
        <header className="admin-header">
          <h1 className="admin-title">Admin • Projects</h1>
          <p className="admin-subtitle">Create, edit and manage project entries</p>
        </header>
        <ProjectsAdmin />
      </div>
    </Layout>
  );
}

