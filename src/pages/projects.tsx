import React from 'react';
import Layout from '@theme/Layout';
import Projects from '../components/Projects';
import { HttpDataProvider, JsonDataProvider } from '../context';
import { useConfig } from '../components/Projects/hooks';

export default function ProjectsPage(): React.ReactElement {
  const config = useConfig();

  return (
    <Layout title="Projects" description="Showcase of my development projects">
      <main>
        {config.provider === 'http' ? (
          <HttpDataProvider endpoint={config.location} autoFetch={true}>
            <Projects />
          </HttpDataProvider>
        ) : (
          <JsonDataProvider location={config.location}>
            <Projects />
          </JsonDataProvider>
        )}
      </main>
    </Layout>
  );
}
