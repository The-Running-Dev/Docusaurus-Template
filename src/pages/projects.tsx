import React from 'react';
import Layout from '@theme/Layout';
import Projects from '../components/Projects';

export default function ProjectsPage(): React.ReactElement {
  return (
    <Layout title="Projects" description="Showcase of my development projects">
      <main>
        <Projects />
      </main>
    </Layout>
  );
}
