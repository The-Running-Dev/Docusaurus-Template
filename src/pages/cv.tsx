import React from 'react';
import Layout from '@theme/Layout';
import CV from '../components/CV';

export default function CVPage(): React.ReactElement {
  return (
    <Layout title="CV/Resume" description="Professional CV/Resume">
      <main>
        <CV />
      </main>
    </Layout>
  );
}
