import { Children, use, type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/core/lib/client/exports/useDocusaurusContext';
import Heading from '@theme/Heading';

import DebugInfo from '../DebugInfo';
import Loading from '../Loading';
import Tooltip from '../Tooltip';

import { useFeaturesConfig } from '../../config';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useProjects } from '../../hooks/useProjects';
import { Project, ProjectCategory, StatItem } from './models';

import './portfolio.css';
import './portfolio-reader.css';

export default function Portfolio(): ReactNode {
  const features = useFeaturesConfig();
  const { siteConfig } = useDocusaurusContext();
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
          <Heading as="h1" className="hero__title">
            {header.title || siteConfig.title}
          </Heading>
          <p className="heroSubtitle">{header.subtitle}</p>
        </div>
      </header>

      <main>
        {/* Stats */}
        <section className="stats">
          <div className="container">
            <div className="statsGrid">
              {data.stats.map((stat: StatItem, idx: number) => (
                <div key={idx} className="statItem">
                  <div className="statNumber">{stat.number}</div>
                  <div className="statLabel">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Showcase */}
        <section className="projectShowcase">
          <div className="container">
            <Heading as="h2" className="sectionTitle">
              Categories
            </Heading>
            <div className="projectGrid">
              {data.projects.map((category: ProjectCategory, idx: number) => (
                <ProjectsLink
                  key={idx}
                  configuredLink=""
                  filter={`category-${category.category.toLowerCase()}`}
                  className="projectCard"
                >
                  <div className="projectIcon">{category.icon}</div>
                  <Heading as="h3" className="projectTitle">
                    {category.category}
                  </Heading>
                  <p className="projectDescription">{category.description}</p>
                </ProjectsLink>
              ))}
            </div>

            {/* Cross-component feature: Show recent projects from projects data */}
            {allProjects.length > 0 && (
              <>
                <Heading
                  as="h3"
                  className="sectionTitle"
                  style={{ marginTop: '2rem', fontSize: '1.5rem' }}
                >
                  Recent Projects
                </Heading>
                <div className="projectGrid">
                  {allProjects.slice(0, 3).map((project, idx) => (
                    <div
                      key={`cross-${idx}`}
                      className="projectCard"
                      style={{ opacity: 0.8 }}
                    >
                      <Heading as="h4" className="projectTitle">
                        {project.title}
                      </Heading>
                      <p className="projectDescription">{project.summary}</p>
                      {project.tags && (
                        <div className="portfolioProjectTags">
                          {project.tags
                            .slice(0, 3)
                            .map((tag: string, tagIdx: number) => (
                              <span
                                key={tagIdx}
                                className="portfolioProjectTag"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* TechStack */}
        <section className="techStack">
          <div className="container">
            <Heading as="h2" className="sectionTitle">
              Technologies & Skills
            </Heading>
            <div className="techGrid">
              {flattenedTechs.map((tech, idx: number) => {
                const techCardContent = (
                  <div key={idx} className="techItem">
                    <span className="techName">
                      {tech.name}
                      {tech.subCategories && tech.subCategories.length > 0 && (
                        <span className="techIndicator">▼</span>
                      )}
                    </span>
                    <span className="techCategory">{tech.category}</span>
                  </div>
                );

                const techCard = (
                  <ProjectsLink
                    configuredLink={tech.link}
                    filter={`tag-${tech.name.toLowerCase()}`}
                  >
                    {techCardContent}
                  </ProjectsLink>
                );

                if (tech.subCategories && tech.subCategories.length > 0) {
                  return (
                    <Tooltip
                      key={idx}
                      title={tech.name}
                      items={tech.subCategories}
                      position="auto"
                    >
                      {techCard}
                    </Tooltip>
                  );
                }

                return techCard;
              })}
            </div>
          </div>
        </section>
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

function ProjectsLink({
  configuredLink,
  filter,
  className,
  children
}: {
  configuredLink?: string;
  filter: string;
  className?: string;
  children: ReactNode;
}) {
  const features = useFeaturesConfig();
  const { getProjectsByTag } = useProjects();

  if (!features.projectsPage) {
    return <div className={className}>{children}</div>;
  }

  // For tag filters, check if projects exist for this tag
  if (!configuredLink && filter.startsWith('tag-')) {
    const tagName = filter.replace('tag-', '');
    const projectsForTag = getProjectsByTag(tagName);

    // Only create link if projects exist for this tag
    if (projectsForTag.length === 0) {
      return <div className={className}>{children}</div>;
    }
  }

  const link =
    configuredLink || `/projects?filter=${encodeURIComponent(filter)}`;

  return (
    <Link to={link} className={className}>
      {children}
    </Link>
  );
}
