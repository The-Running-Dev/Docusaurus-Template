import type { ReactNode } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/core/lib/client/exports/useDocusaurusContext';
import Heading from '@theme/Heading';

import DataProviderComponent from '../DataComponent';
import DebugInfo from '../DebugInfo';

import { Features } from '../../config/FeaturesConfig';
import { DEFAULT_PORTFOLIO_DATA } from './constants';

import './portfolio.css';
import './portfolio-reader.css';

export default function Portfolio(): ReactNode {
  return (
    <DataProviderComponent
      feature={Features.PortfolioPage}
      defaultData={DEFAULT_PORTFOLIO_DATA}
    >
      {(data, loading, error, meta) => {
        if (loading) {
          return (
            <div className="portfolio-wrap">
              <p>Loading Portfolio...</p>
            </div>
          );
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

        return (
          <>
            <Header data={data} />
            <main>
              <Stats data={data} />
              <Showcase data={data} />
              <TechStack data={data} />
            </main>
            <DebugInfo
              loading={loading}
              error={error}
              meta={meta}
              data={data}
            />
          </>
        );
      }}
    </DataProviderComponent>
  );
}

function Header({ data }: { data: any }) {
  const { siteConfig } = useDocusaurusContext();
  const { header } = data;

  return (
    <header className={clsx('hero hero--primary', 'heroBanner')}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {header.title || siteConfig.title}
        </Heading>
        <p className="heroSubtitle">{header.subtitle}</p>
      </div>
    </header>
  );
}

function TechStack({ data }: { data: any }) {
  const { technologies } = data;

  return (
    <section className="techStack">
      <div className="container">
        <Heading as="h2" className="sectionTitle">
          Technologies & Skills
        </Heading>
        <div className="techGrid">
          {technologies.map((tech, idx) => (
            <div key={idx} className="techItem">
              <span className="techName">{tech.name}</span>
              <span className="techCategory">{tech.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase({ data }: { data: any }) {
  const { projects } = data;

  return (
    <section className="projectShowcase">
      <div className="container">
        <Heading as="h2" className="sectionTitle"></Heading>
        <div className="projectGrid">
          {projects.map((project, idx) => (
            <a key={idx} href={project.link} className="projectCard">
              <div className="projectIcon">{project.icon}</div>
              <Heading as="h3" className="projectTitle">
                {project.title}
              </Heading>
              <p className="projectDescription">{project.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ data }: { data: any }) {
  const { stats } = data;

  return (
    <section className="stats">
      <div className="container">
        <div className="statsGrid">
          {stats.map((stat, idx) => (
            <div key={idx} className="statItem">
              <div className="statNumber">{stat.number}</div>
              <div className="statLabel">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
