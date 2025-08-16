import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Badges from '../../components/Badges';
import RelatedResources from '../../components/RelatedResources';

/**
 * Badges Component Demo Page
 * Demonstrates the dynamic badge generation system
 */
export default function BadgesDemo(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const badgeCategories = {
    build: {
      name: '🏗️ Build & Release',
      description: 'Build status, releases, and deployment badges',
      badges: ['build', 'release', 'version', 'deployment']
    },
    quality: {
      name: '✅ Code Quality',
      description: 'Code quality metrics and analysis badges',
      badges: ['coverage', 'quality', 'security', 'maintainability']
    },
    activity: {
      name: '📈 Repository Activity',
      description: 'Activity and engagement metrics',
      badges: ['commits', 'contributors', 'issues', 'pulls']
    },
    stats: {
      name: '⭐ Repository Stats',
      description: 'Stars, forks, and popularity metrics',
      badges: ['stars', 'forks', 'watchers', 'downloads']
    },
    documentation: {
      name: '📚 Documentation',
      description: 'Documentation and support badges',
      badges: ['docs', 'wiki', 'examples', 'support']
    },
    social: {
      name: '🌐 Social & Community',
      description: 'Social media and community badges',
      badges: ['twitter', 'discord', 'discussions', 'community']
    }
  };

  return (
    <Layout
      title="Badges System Demo"
      description="Interactive demonstration of the dynamic badge generation system"
    >
      <div className="container margin-top--md">
        <div className="row">
          <div className="col col--12">
            <header className="text--center margin-bottom--lg">
              <h1 className="margin-bottom--sm">🏷️ Badges System</h1>
              <p className="margin-bottom--none text--secondary">
                Generate dynamic badges for GitHub repositories with
                customizable categories, template variables, and multiple badge
                providers. Perfect for project showcases and documentation.
              </p>
            </header>

            <main>
              {/* Live Badges Display */}
              <section className="margin-bottom--lg">
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h2>🔄 Live Badges for This Repository</h2>
                  </div>
                  <div className="card__body">
                    <p>
                      Dynamic badges generated for the Docusaurus Template
                      repository:
                    </p>
                    <div className="margin-top--lg">
                      <Badges />
                    </div>
                  </div>
                </div>
              </section>

              {/* Badge Categories */}
              <section className="margin-bottom--lg">
                <h2>📂 Badge Categories</h2>
                <div className="tabs">
                  <ul className="tabs__item-list" role="tablist">
                    <li
                      className={`tabs__item ${activeCategory === 'all' ? 'tabs__item--active' : ''}`}
                      role="tab"
                      onClick={() => setActiveCategory('all')}
                    >
                      🌟 All Badges
                    </li>
                    {Object.entries(badgeCategories).map(([key, category]) => (
                      <li
                        key={key}
                        className={`tabs__item ${activeCategory === key ? 'tabs__item--active' : ''}`}
                        role="tab"
                        onClick={() => setActiveCategory(key)}
                      >
                        {category.name.split(' ')[0]}{' '}
                        {
                          category.name
                            .split(' ')
                            .slice(1)
                            .join(' ')
                            .split('&')[0]
                        }
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="margin-top--lg">
                  {activeCategory === 'all' && (
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🌟 Complete Badge Collection</h3>
                      </div>
                      <div className="card__body">
                        <p>
                          All available badges for comprehensive project
                          documentation:
                        </p>
                        <div className="margin-top--lg">
                          <Badges />
                        </div>
                        <div className="margin-top--lg">
                          <div className="alert alert--info">
                            <h4>💡 Badge Groups</h4>
                            <p>
                              Badges are organized into logical groups for
                              better presentation and maintenance:
                            </p>
                            <ul>
                              {Object.entries(badgeCategories).map(
                                ([key, category]) => (
                                  <li key={key}>
                                    <strong>{category.name}:</strong>{' '}
                                    {category.description}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeCategory !== 'all' &&
                    badgeCategories[activeCategory] && (
                      <div className="card shadow--tl">
                        <div className="card__header">
                          <h3>{badgeCategories[activeCategory].name}</h3>
                        </div>
                        <div className="card__body">
                          <p>{badgeCategories[activeCategory].description}</p>
                          <div className="margin-top--lg">
                            <div className="alert alert--success">
                              <h4>📊 Category Preview</h4>
                              <p>
                                This would show only{' '}
                                {badgeCategories[
                                  activeCategory
                                ].name.toLowerCase()}{' '}
                                badges. The badge system supports filtering by
                                categories for focused displays.
                              </p>
                            </div>
                          </div>
                          <div className="margin-top--md">
                            <h4>Included Badge Types:</h4>
                            <ul>
                              {badgeCategories[activeCategory].badges.map(
                                (badge) => (
                                  <li
                                    key={badge}
                                    style={{ textTransform: 'capitalize' }}
                                  >
                                    {badge.replace(/_/g, ' ')} Badge
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </section>

              {/* Configuration Examples */}
              <section className="margin-bottom--lg">
                <h2>⚙️ Configuration</h2>
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h3>Basic Usage</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>{`import Badges from '@site/src/components/Badges';

// Default badges (uses badges.yml configuration)
<Badges />

// Custom repository
<Badges user="facebook" repository="react" />

// Specific badge groups only
<Badges groups={['build', 'quality']} />`}</code>
                    </pre>
                  </div>
                </div>

                <div className="card shadow--tl margin-top--md">
                  <div className="card__header">
                    <h3>Badge Configuration (badges.yml)</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>{`# Template variables
templateVariables:
  user: "The-Running-Dev"
  repository: "Docusaurus-Template"
  branch: "main"

# Badge groups and definitions
badgeGroups:
  build:
    - name: "Build Status"
      url: "https://github.com/{user}/{repository}/actions"
      image: "https://github.com/{user}/{repository}/workflows/CI/badge.svg"
  
  quality:
    - name: "Code Quality"
      url: "https://sonarcloud.io/project/{user}_{repository}"
      image: "https://sonarcloud.io/api/badges/measure?project={user}_{repository}&metric=alert_status"
  
  # ... more badge groups`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Badge Providers */}
              <section className="margin-bottom--lg">
                <h2>🌐 Supported Badge Providers</h2>
                <div className="row">
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🏗️ CI/CD & Build</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>✅ GitHub Actions</li>
                          <li>✅ Travis CI</li>
                          <li>✅ CircleCI</li>
                          <li>✅ Azure DevOps</li>
                          <li>✅ Jenkins</li>
                          <li>✅ GitLab CI</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>📊 Quality & Analytics</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>✅ Codecov</li>
                          <li>✅ SonarCloud</li>
                          <li>✅ Code Climate</li>
                          <li>✅ Codacy</li>
                          <li>✅ Snyk Security</li>
                          <li>✅ LGTM</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row margin-top--md">
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>📦 Package Managers</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>✅ NPM</li>
                          <li>✅ PyPI</li>
                          <li>✅ NuGet</li>
                          <li>✅ Maven Central</li>
                          <li>✅ Docker Hub</li>
                          <li>✅ Homebrew</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>📈 Social & Stats</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>✅ GitHub Stats (Stars, Forks)</li>
                          <li>✅ Download Counters</li>
                          <li>✅ Social Media Links</li>
                          <li>✅ Community Badges</li>
                          <li>✅ Contribution Stats</li>
                          <li>✅ Issue/PR Counters</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features */}
              <section className="margin-bottom--lg">
                <h2>⚡ System Features</h2>
                <div className="row">
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🔧 Template System</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>
                            ✅ <strong>Variable Substitution:</strong>{' '}
                            {'{user}, {repository}, {branch}'}
                          </li>
                          <li>
                            ✅ <strong>Dynamic URLs:</strong> Auto-generated
                            badge links
                          </li>
                          <li>
                            ✅ <strong>Environment Support:</strong> Different
                            badges per environment
                          </li>
                          <li>
                            ✅ <strong>Custom Variables:</strong> Define your
                            own template variables
                          </li>
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
                          <li>
                            ✅ <strong>Group Filtering:</strong> Show specific
                            badge categories
                          </li>
                          <li>
                            ✅ <strong>Responsive Layout:</strong> Adapts to
                            screen size
                          </li>
                          <li>
                            ✅ <strong>Theme Integration:</strong> Matches site
                            theme
                          </li>
                          <li>
                            ✅ <strong>Custom Styling:</strong> Override badge
                            appearance
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Use Cases */}
              <section className="margin-bottom--lg">
                <h2>💡 Common Use Cases</h2>
                <div className="row">
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>📱 Project Pages</h3>
                        <ul>
                          <li>Repository showcases</li>
                          <li>Project documentation</li>
                          <li>Portfolio websites</li>
                          <li>Landing pages</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>📚 Documentation</h3>
                        <ul>
                          <li>API documentation</li>
                          <li>User guides</li>
                          <li>Technical specs</li>
                          <li>Status pages</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🎯 Marketing</h3>
                        <ul>
                          <li>Open source promotion</li>
                          <li>Community building</li>
                          <li>Trust indicators</li>
                          <li>Quality signals</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <RelatedResources
                description="Learn more about the badge system and project showcase features"
                links={[
                  {
                    href: '/docs/core-systems/badge-system',
                    label: '📖 Badge System Docs',
                    type: 'primary'
                  },
                  {
                    href: '/docs/configuration/',
                    label: '⚙️ Configuration Guide',
                    type: 'secondary'
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
