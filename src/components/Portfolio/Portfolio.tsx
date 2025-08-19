import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/core/lib/client/exports/useDocusaurusContext';
import Heading from '@theme/Heading';

import DataProvider from '../DataProvider';
import DebugInfo from '../DebugInfo';
import Loading from '../Loading';
import Tooltip from '../Tooltip';

import { Features, useFeaturesConfig } from '../../config/FeaturesConfig';
import { DEFAULT_PORTFOLIO_DATA } from './constants';

import './portfolio.css';
import './portfolio-reader.css';

function createLink(
  data: any,
  text: string,
  dataType: 'technology' | 'project',
  featuresConfig: any
) {
  // Check if the projects page is enabled
  if (!featuresConfig.projectsPage) {
    // If projects page is disabled, return the provided link or empty string
    return data.link || '';
  }

  // If the provided data has a link specified, just use that link
  if (data.link) {
    return data.link;
  }

  if (dataType === 'technology') {
    const tag = text.toLowerCase();
    return `/projects?filter=tag-${encodeURIComponent(tag)}`;
  } else if (dataType === 'project') {
    const tag = text.toLowerCase();
    return `/projects?filter=${encodeURIComponent(tag)}`;
  }

  return '';
}

export default function Portfolio(): ReactNode {
  const featuresConfig = useFeaturesConfig();

  return (
    <DataProvider
      feature={Features.PortfolioPage}
      defaultData={DEFAULT_PORTFOLIO_DATA}
    >
      {(data, loading, error, meta) => {
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

        return (
          <>
            <Header data={data} />
            <main>
              <Stats data={data} />
              <Showcase
                data={data}
                featuresConfig={featuresConfig}
              />
              <TechStack
                data={data}
                featuresConfig={featuresConfig}
              />
            </main>
            <DebugInfo
              loading={loading}
              error={error}
              meta={meta}
              metrics={[
                {
                  label: '🧬 Technologies',
                  value: data?.technologies?.length || 0
                },
                {
                  label: '🔧 Sub-Categories',
                  value:
                    data?.technologies?.reduce(
                      (total, tech) =>
                        total + (tech.subCategories?.length || 0),
                      0
                    ) || 0
                },
                {
                  label: '📁 Projects',
                  value: data?.projects?.length || 0
                },
                {
                  label: '🏆 Stats',
                  value: data?.stats?.length || 0
                }
              ]}
            />
          </>
        );
      }}
    </DataProvider>
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

function Showcase({
  data,
  featuresConfig
}: {
  data: any;
  featuresConfig: any;
}) {
  const { projects } = data;

  return (
    <section className="projectShowcase">
      <div className="container">
        <Heading as="h2" className="sectionTitle"></Heading>
        <div className="projectGrid">
          {projects.map((project, idx) => {
            const projectLink = createLink(
              project,
              project.tag,
              'project',
              featuresConfig
            );

            return (
              <a key={idx} href={projectLink} className="projectCard">
                <div className="projectIcon">{project.icon}</div>
                <Heading as="h3" className="projectTitle">
                  {project.title}
                </Heading>
                <p className="projectDescription">{project.description}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TechStack({
  data,
  featuresConfig
}: {
  data: any;
  featuresConfig: any;
}) {
  const { technologies } = data;

  // Flatten the hierarchical structure into individual tech items
  const flattenedTechs = technologies.flatMap((category: any) => {
    const categoryName = category.name;

    if (!category.subCategories || category.subCategories.length === 0) {
      // Category with no sub-categories becomes a single item
      const link = createLink(
        category,
        categoryName,
        'technology',
        featuresConfig
      );

      return [
        {
          name: categoryName,
          link: link,
          category: categoryName,
          subCategories: undefined
        }
      ];
    }

    // Flatten sub-categories into individual items
    return category.subCategories.map((subCat: any) => {
      const link = createLink(
        subCat,
        subCat.name,
        'technology',
        featuresConfig
      );

      return {
        name: subCat.name,
        link: link,
        category: categoryName,
        subCategories: subCat.subCategories || undefined
      };
    });
  });

  return (
    <section className="techStack">
      <div className="container">
        <Heading as="h2" className="sectionTitle">
          Technologies & Skills
        </Heading>
        <div className="techGrid">
          {flattenedTechs.map((tech, idx) => {
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

            const techCard = tech.link ? (
              <Link to={tech.link}>{techCardContent}</Link>
            ) : (
              techCardContent
            );

            // Wrap with tooltip if sub-categories exist
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
  );
}
