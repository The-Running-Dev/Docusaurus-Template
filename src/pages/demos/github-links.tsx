import React, { useState } from 'react';
import Layout from '@theme/Layout';
import GitHubLinks from '../../components/GitHubLinks';
import RelatedResources from '../../components/RelatedResources';

/**
 * GitHub Links Demo Page
 * Demonstrates the dynamic GitHub repository links system
 */
export default function GitHubLinksDemo(): React.JSX.Element {
  const [displayMode, setDisplayMode] = useState<'dropdown' | 'inline'>(
    'dropdown'
  );

  const linkCategories = {
    repository: {
      name: '📁 Repository Links',
      description: 'Direct links to repository sections and features',
      links: [
        'Repository',
        'Issues',
        'Pull Requests',
        'Discussions',
        'Actions',
        'Projects'
      ]
    },
    code: {
      name: '💻 Code & Development',
      description: 'Links for developers and contributors',
      links: [
        'Source Code',
        'Releases',
        'Tags',
        'Branches',
        'Commits',
        'Contributors'
      ]
    },
    community: {
      name: '👥 Community & Docs',
      description: 'Community engagement and documentation',
      links: [
        'Wiki',
        'Documentation',
        'Community Guidelines',
        'Code of Conduct',
        'Contributing'
      ]
    },
    analytics: {
      name: '📊 Analytics & Insights',
      description: 'Repository statistics and insights',
      links: ['Insights', 'Network', 'Forks', 'Stars', 'Watchers', 'Traffic']
    }
  };

  return (
    <Layout
      title="GitHub Links Demo"
      description="Interactive demonstration of the dynamic GitHub repository links system"
    >
      <div className="container margin-top--lg">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <header className="text--center margin-bottom--xl">
              <h1>🔗 GitHub Links</h1>
              <p className="hero__subtitle">
                Dynamic GitHub repository links with customizable categories,
                display modes, and automatic integration. Perfect for project
                navigation and community engagement.
              </p>
            </header>

            <main>
              {/* Live GitHub Links */}
              <section className="margin-bottom--lg">
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h2>🔄 Live GitHub Links</h2>
                  </div>
                  <div className="card__body">
                    <p>Dynamic links for the Docusaurus Template repository:</p>
                    <div className="margin-top--lg text--center">
                      <GitHubLinks />
                    </div>
                  </div>
                </div>
              </section>

              {/* Display Modes */}
              <section className="margin-bottom--lg">
                <h2>🎨 Display Modes</h2>
                <div className="tabs">
                  <ul className="tabs__item-list" role="tablist">
                    <li
                      className={`tabs__item ${displayMode === 'dropdown' ? 'tabs__item--active' : ''}`}
                      role="tab"
                      onClick={() => setDisplayMode('dropdown')}
                    >
                      📋 Dropdown Menu
                    </li>
                    <li
                      className={`tabs__item ${displayMode === 'inline' ? 'tabs__item--active' : ''}`}
                      role="tab"
                      onClick={() => setDisplayMode('inline')}
                    >
                      📌 Inline Links
                    </li>
                  </ul>
                </div>

                <div className="margin-top--lg">
                  {displayMode === 'dropdown' && (
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>📋 Dropdown Menu Mode</h3>
                      </div>
                      <div className="card__body">
                        <p>
                          Compact dropdown menu ideal for navigation bars and
                          space-constrained areas:
                        </p>
                        <div className="margin-top--lg text--center">
                          <GitHubLinks />
                        </div>
                        <div className="margin-top--lg">
                          <h4>Features:</h4>
                          <ul>
                            <li>
                              ✅ <strong>Space Efficient:</strong> Minimal
                              navbar footprint
                            </li>
                            <li>
                              ✅ <strong>Organized Categories:</strong> Links
                              grouped by function
                            </li>
                            <li>
                              ✅ <strong>Icon Integration:</strong> FontAwesome
                              icons for visual clarity
                            </li>
                            <li>
                              ✅ <strong>Responsive:</strong> Adapts to mobile
                              screens
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {displayMode === 'inline' && (
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>📌 Inline Links Mode</h3>
                      </div>
                      <div className="card__body">
                        <p>
                          Direct inline links for content areas and detailed
                          project pages:
                        </p>
                        <div className="margin-top--lg">
                          <div className="alert alert--info">
                            <h4>💡 Inline Links Preview</h4>
                            <p>
                              In inline mode, links would appear as individual
                              buttons or link elements. This mode is perfect for
                              project pages, documentation, and detailed
                              showcases.
                            </p>
                          </div>
                        </div>
                        <div className="margin-top--lg">
                          <h4>Features:</h4>
                          <ul>
                            <li>
                              ✅ <strong>Direct Access:</strong> No dropdown
                              navigation needed
                            </li>
                            <li>
                              ✅ <strong>Visual Prominence:</strong> Links
                              clearly visible
                            </li>
                            <li>
                              ✅ <strong>Customizable Layout:</strong> Grid or
                              list arrangements
                            </li>
                            <li>
                              ✅ <strong>Rich Descriptions:</strong> Detailed
                              link descriptions
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Link Categories */}
              <section className="margin-bottom--lg">
                <h2>📂 Available Link Categories</h2>
                <div className="row">
                  {Object.entries(linkCategories).map(([key, category]) => (
                    <div key={key} className="col col--6 margin-bottom--lg">
                      <div className="card shadow--tl">
                        <div className="card__header">
                          <h3>{category.name}</h3>
                        </div>
                        <div className="card__body">
                          <p>{category.description}</p>
                          <h4>Included Links:</h4>
                          <ul>
                            {category.links.map((link) => (
                              <li key={link}>🔗 {link}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
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
                      <code>{`import GitHubLinks from '@site/src/components/GitHubLinks';

// Default links (uses gitHubLinks.yml configuration)
<GitHubLinks />

// Custom repository
<GitHubLinks user="facebook" repository="react" />

// Inline mode
<GitHubLinks displayMode="inline" />

// Specific link categories
<GitHubLinks categories={['repository', 'code']} />`}</code>
                    </pre>
                  </div>
                </div>

                <div className="card shadow--tl margin-top--md">
                  <div className="card__header">
                    <h3>GitHub Links Configuration (gitHubLinks.yml)</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>{`# Repository information
user: "The-Running-Dev"
repository: "Docusaurus-Template"
branch: "main"

# Display settings
displayMode: "dropdown"
showIcons: true
showDescriptions: false

# Link categories and definitions
links:
  repository:
    - name: "Repository"
      url: "https://github.com/{user}/{repository}"
      icon: "fab fa-github"
      description: "Main repository page"
    
    - name: "Issues"
      url: "https://github.com/{user}/{repository}/issues"
      icon: "fas fa-bug"
      description: "Report bugs and request features"
  
  # ... more link categories`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Integration Features */}
              <section className="margin-bottom--lg">
                <h2>⚡ Integration Features</h2>
                <div className="row">
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🔧 Automatic Integration</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>
                            ✅ <strong>Navbar Item:</strong> Available in site
                            navigation
                          </li>
                          <li>
                            ✅ <strong>Template Variables:</strong>{' '}
                            {'{user}, {repository}, {branch}'} substitution
                          </li>
                          <li>
                            ✅ <strong>Environment Aware:</strong> Different
                            links per environment
                          </li>
                          <li>
                            ✅ <strong>Schema Validation:</strong> Configuration
                            validated with Zod
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🎨 Customization Options</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>
                            ✅ <strong>Icon Support:</strong> FontAwesome icons
                            for all links
                          </li>
                          <li>
                            ✅ <strong>Theme Integration:</strong> Matches site
                            theme colors
                          </li>
                          <li>
                            ✅ <strong>Responsive Design:</strong>{' '}
                            Mobile-friendly layouts
                          </li>
                          <li>
                            ✅ <strong>Accessibility:</strong> Screen reader and
                            keyboard friendly
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
                        <h3>📱 Project Navigation</h3>
                        <ul>
                          <li>Repository navigation</li>
                          <li>Quick access to issues</li>
                          <li>Pull request management</li>
                          <li>Release tracking</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>👥 Community Engagement</h3>
                        <ul>
                          <li>Contribution guidelines</li>
                          <li>Community discussions</li>
                          <li>Issue reporting</li>
                          <li>Feature requests</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>📚 Documentation Sites</h3>
                        <ul>
                          <li>Source code access</li>
                          <li>Example repositories</li>
                          <li>Documentation updates</li>
                          <li>Version tracking</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Advanced Features */}
              <section className="margin-bottom--lg">
                <h2>🚀 Advanced Features</h2>
                <div className="card shadow--tl">
                  <div className="card__body">
                    <div className="row">
                      <div className="col col--6">
                        <h3>🔧 Template System</h3>
                        <ul>
                          <li>
                            ✅ <strong>Variable Substitution:</strong> Dynamic
                            URL generation
                          </li>
                          <li>
                            ✅ <strong>Environment Support:</strong>{' '}
                            Dev/staging/production variations
                          </li>
                          <li>
                            ✅ <strong>Custom Variables:</strong> Define
                            additional template variables
                          </li>
                          <li>
                            ✅ <strong>Conditional Links:</strong> Show/hide
                            based on conditions
                          </li>
                        </ul>
                      </div>
                      <div className="col col--6">
                        <h3>🎯 Smart Features</h3>
                        <ul>
                          <li>
                            ✅ <strong>External Link Detection:</strong>{' '}
                            Automatic external link indicators
                          </li>
                          <li>
                            ✅ <strong>Link Validation:</strong> Check link
                            availability
                          </li>
                          <li>
                            ✅ <strong>Analytics Integration:</strong> Track
                            link usage
                          </li>
                          <li>
                            ✅ <strong>Caching Support:</strong> Performance
                            optimized
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Related Resources */}
              <RelatedResources
                title="🔗 Related Resources"
                description="Learn more about GitHub integration and link management:"
                links={[
                  {
                    href: '/docs/core-systems/github-links-system',
                    label: '📖 GitHub Links Docs',
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
