import React from 'react';
import Layout from '@theme/Layout';
import Portfolio from '../components/Portfolio';

export default function PortfolioPage(): React.ReactElement {
  return (
    <Layout
      title="Portfolio"
      description="Technical portfolio showcasing full-stack development, DevOps, and automation projects"
    >
      <main>
        <Portfolio />
      </main>
    </Layout>
  );
}
