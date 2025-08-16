import type { ReactNode } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/core/lib/client/exports/useDocusaurusContext';
import Heading from '@theme/Heading';

import FeatureComponent from '../FeatureComponent';
import { Features } from '../../config/FeaturesConfig';

// @ts-ignore
import { portfolioData as configData } from '../../../data';

import './portfolio.css';
import './portfolio-reader.css';

export default function Portfolio(): ReactNode {
  return (
    <FeatureComponent feature={Features.PortfolioPage} configData={configData}>
      {(data) => {
        if (!data?.header) {
          // last-resort guard to avoid crashing the page
          return (
            <div className="portfolio-wrap">
              <p className="portfolio-muted">No Portfolio Data Found.</p>
            </div>
          );
        }

        return (
          <>
            <HomepageHeader />
            <main>
              <Stats />
              <ProjectShowcase />
              <TechStack />
            </main>
          </>
        );
      }}
    </FeatureComponent>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const { header } = configData;

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

function TechStack() {
  const { technologies } = configData;

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

function ProjectShowcase() {
  const { projects } = configData;

  return (
    <section className="projectShowcase">
      <div className="container">
        <Heading as="h2" className="sectionTitle">
          Categories
        </Heading>
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

function Stats() {
  const { stats } = configData;

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
