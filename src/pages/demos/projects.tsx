import React, { useState } from 'react';
import Layout from '@theme/Layout';
import RelatedResources from '../../components/RelatedResources';

/**
 * Projects Component Demo Page
 * Demonstrates the dynamic project showcase with filtering, search, and data loading options
 */
export default function ProjectsDemo(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'static' | 'http' | 'hybrid'>(
    'static'
  );

  return (
    <Layout
      title="Projects Component Demo"
      description="Interactive demonstration of the Projects component with filtering, search, and data loading"
    >
      <div className="container margin-top--md">
        <div className="row">
          <div className="col col--12">
            <header className="text--center margin-bottom--lg">
              <h1 className="margin-bottom--sm">📊 Projects Component</h1>
              <p className="margin-bottom--none text--secondary">
                Showcase your projects with advanced filtering, search,
                categorization, and multiple data loading options. Perfect for
                portfolios, documentation sites, and project galleries.
              </p>
            </header>

            <main>
              {/* Data Loading Options */}
              <section className="margin-bottom--lg">
                <h2>🔄 Data Loading Options</h2>
                <div className="tabs">
                  <ul className="tabs__item-list" role="tablist">
                    <li
                      className={`tabs__item ${activeTab === 'static' ? 'tabs__item--active' : ''}`}
                      role="tab"
                      onClick={() => setActiveTab('static')}
                    >
                      📁 Static Data
                    </li>
                    <li
                      className={`tabs__item ${activeTab === 'http' ? 'tabs__item--active' : ''}`}
                      role="tab"
                      onClick={() => setActiveTab('http')}
                    >
                      🌐 HTTP API
                    </li>
                    <li
                      className={`tabs__item ${activeTab === 'hybrid' ? 'tabs__item--active' : ''}`}
                      role="tab"
                      onClick={() => setActiveTab('hybrid')}
                    >
                      🔀 Hybrid Loading
                    </li>
                  </ul>
                </div>

                <div className="margin-top--lg">
                  {activeTab === 'static' && (
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>📁 Static Data Loading</h3>
                      </div>
                      <div className="card__body">
                        <p>
                          Projects loaded from static JSON/YAML files. Best for:
                        </p>
                        <ul>
                          <li>Personal portfolios</li>
                          <li>Static documentation sites</li>
                          <li>Small to medium project collections</li>
                          <li>Fast loading and offline support</li>
                        </ul>
                        <div className="margin-top--lg">
                          <div className="alert alert--success">
                            <strong>🎯 Live Projects Available!</strong> The
                            interactive Projects component is running live at{' '}
                            <a href="/projects" rel="noopener noreferrer">
                              <strong>/projects</strong>
                            </a>{' '}
                            with real data. See real-time data loading and
                            filtering in action! This demo shows the
                            configuration and usage patterns.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'http' && (
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🌐 HTTP API Loading</h3>
                      </div>
                      <div className="card__body">
                        <p>
                          Projects loaded from external APIs (GitHub, GitLab,
                          etc.). Features:
                        </p>
                        <ul>
                          <li>Real-time project data</li>
                          <li>Automatic updates from repositories</li>
                          <li>Rich metadata (stars, forks, activity)</li>
                          <li>Caching and error handling</li>
                        </ul>
                        <div className="alert alert--info margin-top--lg">
                          <h4>💡 HTTP Demo</h4>
                          <p>
                            This would load projects from your GitHub profile or
                            API endpoint. For security and performance, HTTP
                            loading is disabled in this demo. See the{' '}
                            <a href="/docs/core-systems/data-caching-system">
                              Data & Caching System docs
                            </a>{' '}
                            for implementation details.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'hybrid' && (
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🔀 Hybrid Loading</h3>
                      </div>
                      <div className="card__body">
                        <p>
                          Combines static and dynamic data for optimal
                          performance:
                        </p>
                        <ul>
                          <li>
                            Static data for core projects (fast initial load)
                          </li>
                          <li>Dynamic data for live statistics</li>
                          <li>Fallback to cached data when API unavailable</li>
                          <li>Progressive enhancement strategy</li>
                        </ul>
                        <div className="margin-top--lg">
                          <div className="alert alert--success">
                            <h4>🔄 Hybrid Loading Demo</h4>
                            <p>
                              Shows projects with fallback support and
                              progressive enhancement.
                            </p>
                          </div>
                          <div className="alert alert--success">
                            <strong>🎯 Live Projects Available!</strong> The
                            interactive Projects component is running live at{' '}
                            <a href="/projects" rel="noopener noreferrer">
                              <strong>/projects</strong>
                            </a>{' '}
                            with real data. See real-time data loading and
                            filtering in action! This demo shows the
                            configuration and usage patterns.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Feature Showcase */}
              <section className="margin-bottom--lg">
                <h2>⚡ Component Features</h2>
                <div className="row">
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🔍 Search & Filtering</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>✅ Real-time text search across all fields</li>
                          <li>✅ Category-based filtering</li>
                          <li>✅ Tag-based filtering</li>
                          <li>
                            ✅ Status filtering (Active, Development, Archived)
                          </li>
                          <li>✅ Featured projects highlighting</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🎨 Display Options</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>✅ Grid and list view options</li>
                          <li>✅ Responsive design</li>
                          <li>✅ Customizable card layouts</li>
                          <li>✅ Theme-aware styling</li>
                          <li>✅ Loading states and error handling</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Configuration Examples */}
              <section className="margin-bottom--lg">
                <h2>⚙️ Configuration Options</h2>
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h3>Basic Configuration</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>{`import Projects from '@site/src/components/Projects';

// Static data example
<Projects 
  projectsData={staticProjectsData}
  enableSearch={true}
  enableFiltering={true}
  showCategories={true}
  gridColumns={3}
/>

// HTTP API example
<Projects 
  apiEndpoint="/api/projects"
  fallbackToStatic={true}
  cacheTimeout={300000} // 5 minutes
  enableSearch={true}
  enableFiltering={true}
/>

// Minimal configuration
<Projects projectsData={projects} />`}</code>
                    </pre>
                  </div>
                </div>

                <div className="card shadow--tl margin-top--md">
                  <div className="card__header">
                    <h3>Data Schema (projects.yml)</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>{`projects:
  - id: "project-id"
    name: "Project Name"
    description: "Project description"
    url: "https://github.com/user/repo"
    tags: ["React", "TypeScript"]
    category: "library"
    featured: true
    status: "active"
    # ... more fields`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Integration Information */}
              <RelatedResources
                title="🔗 Integration & Documentation"
                description="Learn more about implementing and customizing the Projects component"
                links={[
                  {
                    href: '/projects',
                    label: '🚀 Live Projects Page',
                    type: 'primary'
                  },
                  {
                    href: '/docs/core-systems/components-system',
                    label: '📖 Components System',
                    type: 'secondary'
                  },
                  {
                    href: '/docs/core-systems/data-caching-system',
                    label: '🔄 Data & Caching',
                    type: 'secondary'
                  },
                  {
                    href: '/docs/core-systems/schema-system',
                    label: '🛡️ Schema Validation',
                    type: 'outline'
                  }
                ]}
              />
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
