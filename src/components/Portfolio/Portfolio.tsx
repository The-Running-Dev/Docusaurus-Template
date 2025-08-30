import { type ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';

import DebugInfo from '../DebugInfo';
import Loading from '../Loading';
import { Categories, RecentProjects, Stats, TechStack } from './components';
import { useFeaturesConfig } from '../../config';
import { usePortfolio, useProjects } from '../../hooks/';

import './portfolio.css';
import './portfolio-reader.css';

export default function Portfolio(): ReactNode {
  const features = useFeaturesConfig();
  const { data, loading, error, getStats, getFlattenedTechnologies } =
    usePortfolio();
  const { getAllProjects, getRecentProjects } = useProjects();

  if (!features.portfolioPage) {
    return null;
  }

  if (loading) {
    return <Loading message="🔄 Loading Portfolio..." useWrap={true} />;
  }

  if (error) {
    return (
      <div className="portfolio-wrap">
        <p>Error Loading Portfolio: {error.message}</p>
      </div>
    );
  }

  if (!data?.header) {
    return (
      <div className="portfolio-wrap">
        <p className="portfolio-muted">No Portfolio Data Found.</p>
      </div>
    );
  }

  // Cross-component data access
  const allProjects = getAllProjects();
  const recentProjects = getRecentProjects();
  const portfolioStats = getStats();
  const flattenedTechs = getFlattenedTechnologies();
  const { header } = data;

  return (
    <>
      {/* Header */}
      <header className={clsx('hero hero--primary', 'heroBanner')}>
        <div className="container">
          <Heading as="h1" className="hero__title">{header.title}</Heading>
          <p className="heroSubtitle">{header.subtitle}</p>
        </div>
      </header>

      <main>
        <Stats stats={data.stats} />
        <Categories categories={data.projects} />
        <RecentProjects projects={recentProjects} />
        <TechStack technologies={flattenedTechs} />
      </main>

      <DebugInfo
        loading={loading}
        error={error}
        meta={{
          provider: 'DataStore',
          source: 'global',
          timestamp: new Date().toISOString(),
          dataSize: data ? JSON.stringify(data).length : 0
        }}
        metrics={[
          {
            label: '🧬 Technologies',
            value: data?.technologies?.length || 0
          },
          {
            label: '🔧 Sub-Categories',
            value: portfolioStats?.totalSubCategories || 0
          },
          {
            label: '📁 Portfolio Projects',
            value: data?.projects?.length || 0
          },
          {
            label: '🎯 All Projects',
            value: allProjects.length
          },
          {
            label: '⚡ Recent Projects',
            value: recentProjects.length
          },
          {
            label: '🏆 Stats',
            value: data?.stats?.length || 0
          }
        ]}
      />
    </>
  );
}
