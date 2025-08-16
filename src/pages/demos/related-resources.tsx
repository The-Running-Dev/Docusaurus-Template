import React from 'react';
import Layout from '@theme/Layout';
import RelatedResources from '../../components/RelatedResources';

/**
 * Related Resources Demo Page
 * Demonstrates the RelatedResources component with various configurations
 */
export default function RelatedResourcesDemo(): React.JSX.Element {
  return (
    <Layout
      title="Related Resources Demo"
      description="Interactive demonstration of the RelatedResources component for contextual navigation"
    >
      <div className="container margin-top--md">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <header className="text--center margin-bottom--lg">
              <h1 className="margin-bottom--sm">🔗 Related Resources</h1>
              <p className="margin-bottom--none text--secondary">
                A reusable component for displaying contextual navigation links
                at the end of documentation pages and demos.
              </p>
            </header>

            <main>
              {/* Basic Example */}
              <section className="margin-bottom--lg">
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h2>📝 Basic Usage</h2>
                  </div>
                  <div className="card__body">
                    <p>The simplest form with default title and a few links:</p>

                    {/* Live Example */}
                    <div className="margin-top--lg">
                      <RelatedResources
                        links={[
                          {
                            href: '/docs/core-systems/related-resources-component',
                            label: '📖 Documentation',
                            type: 'primary'
                          },
                          {
                            href: '/docs/getting-started',
                            label: '🚀 Getting Started',
                            type: 'secondary'
                          }
                        ]}
                      />
                    </div>

                    <details className="margin-top--lg">
                      <summary>View Code</summary>
                      <pre className="margin-top--md">
                        <code>{`<RelatedResources
  links={[
    {
      href: '/docs/core-systems/related-resources-component',
      label: '📖 Documentation',
      type: 'primary'
    },
    {
      href: '/docs/getting-started',
      label: '🚀 Getting Started',
      type: 'secondary'
    }
  ]}
/>`}</code>
                      </pre>
                    </details>
                  </div>
                </div>
              </section>

              {/* Custom Title and Description */}
              <section className="margin-bottom--lg">
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h2>🎨 Custom Title & Description</h2>
                  </div>
                  <div className="card__body">
                    <p>Customize the title and add a helpful description:</p>

                    {/* Live Example */}
                    <div className="margin-top--lg">
                      <RelatedResources
                        title="🎯 Next Steps"
                        description="Continue your journey with these helpful resources and guides:"
                        links={[
                          {
                            href: '/docs/core-systems',
                            label: 'Core Systems',
                            type: 'primary'
                          },
                          {
                            href: '/demos',
                            label: 'More Demos',
                            type: 'secondary'
                          },
                          {
                            href: '/docs/configuration',
                            label: 'Configuration',
                            type: 'outline'
                          }
                        ]}
                      />
                    </div>

                    <details className="margin-top--lg">
                      <summary>View Code</summary>
                      <pre className="margin-top--md">
                        <code>{`<RelatedResources
  title="🎯 Next Steps"
  description="Continue your journey with these helpful resources and guides:"
  links={[
    {
      href: '/docs/core-systems',
      label: 'Core Systems',
      type: 'primary'
    },
    {
      href: '/demos',
      label: 'More Demos',
      type: 'secondary'
    },
    {
      href: '/docs/configuration',
      label: 'Configuration',
      type: 'outline'
    }
  ]}
/>`}</code>
                      </pre>
                    </details>
                  </div>
                </div>
              </section>

              {/* External Links */}
              <section className="margin-bottom--lg">
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h2>🌐 External Links</h2>
                  </div>
                  <div className="card__body">
                    <p>
                      Handle external links with proper security attributes:
                    </p>

                    {/* Live Example */}
                    <div className="margin-top--lg">
                      <RelatedResources
                        title="🔗 External Resources"
                        description="Explore these external documentation and resources:"
                        links={[
                          {
                            href: 'https://docusaurus.io/docs',
                            label: 'Docusaurus Docs',
                            type: 'primary',
                            external: true
                          },
                          {
                            href: 'https://github.com/facebook/docusaurus',
                            label: 'GitHub Repository',
                            type: 'secondary',
                            external: true
                          },
                          {
                            href: 'https://docusaurus.io/community',
                            label: 'Community',
                            type: 'outline',
                            external: true
                          }
                        ]}
                      />
                    </div>

                    <details className="margin-top--lg">
                      <summary>View Code</summary>
                      <pre className="margin-top--md">
                        <code>{`<RelatedResources
  title="🔗 External Resources"
  description="Explore these external documentation and resources:"
  links={[
    {
      href: 'https://docusaurus.io/docs',
      label: 'Docusaurus Docs',
      type: 'primary',
      external: true
    },
    {
      href: 'https://github.com/facebook/docusaurus',
      label: 'GitHub Repository',
      type: 'secondary',
      external: true
    },
    {
      href: 'https://docusaurus.io/community',
      label: 'Community',
      type: 'outline',
      external: true
    }
  ]}
/>`}</code>
                      </pre>
                    </details>
                  </div>
                </div>
              </section>

              {/* Button Types Showcase */}
              <section className="margin-bottom--lg">
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h2>🎨 Button Type Variations</h2>
                  </div>
                  <div className="card__body">
                    <p>
                      Compare the three button types: primary, secondary, and
                      outline:
                    </p>

                    {/* Live Example */}
                    <div className="margin-top--lg">
                      <RelatedResources
                        title="🎭 Button Styles"
                        description="Each button type serves a different purpose in the visual hierarchy:"
                        links={[
                          {
                            href: '/docs',
                            label: 'Primary Action',
                            type: 'primary'
                          },
                          {
                            href: '/docs',
                            label: 'Secondary Action',
                            type: 'secondary'
                          },
                          {
                            href: '/docs',
                            label: 'Outline Action',
                            type: 'outline'
                          }
                        ]}
                      />
                    </div>

                    <div className="margin-top--lg">
                      <h4>🎯 Usage Guidelines:</h4>
                      <ul>
                        <li>
                          <strong>Primary:</strong> Main call-to-action, most
                          important link
                        </li>
                        <li>
                          <strong>Secondary:</strong> Supporting or alternative
                          actions
                        </li>
                        <li>
                          <strong>Outline:</strong> Subtle, less prominent links
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Technical Features */}
              <section className="margin-bottom--lg">
                <h2>⚙️ Technical Features</h2>
                <div className="row">
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🔧 Component Features</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>
                            ✅ <strong>TypeScript Support:</strong> Full type
                            safety
                          </li>
                          <li>
                            ✅ <strong>Responsive Design:</strong> Works on all
                            screen sizes
                          </li>
                          <li>
                            ✅ <strong>Docusaurus Integration:</strong> Uses
                            theme tokens
                          </li>
                          <li>
                            ✅ <strong>Accessibility:</strong> Semantic HTML and
                            ARIA
                          </li>
                          <li>
                            ✅ <strong>External Link Safety:</strong> Proper rel
                            attributes
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🎨 Styling Features</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>
                            ✅ <strong>Card Layout:</strong> Clean, consistent
                            design
                          </li>
                          <li>
                            ✅ <strong>Button Groups:</strong> Organized link
                            display
                          </li>
                          <li>
                            ✅ <strong>Custom Classes:</strong> Extensible
                            styling
                          </li>
                          <li>
                            ✅ <strong>Theme Integration:</strong> Automatic
                            dark/light mode
                          </li>
                          <li>
                            ✅ <strong>Consistent Spacing:</strong> Docusaurus
                            utilities
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Common Use Cases */}
              <section className="margin-bottom--lg">
                <h2>💡 Common Use Cases</h2>
                <div className="row">
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>📚 Documentation Pages</h3>
                        <ul>
                          <li>Link to related topics</li>
                          <li>Navigate tutorial series</li>
                          <li>Reference API documentation</li>
                          <li>Access example code</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🎮 Demo Pages</h3>
                        <ul>
                          <li>Link to component docs</li>
                          <li>Navigate to other demos</li>
                          <li>Access source code</li>
                          <li>View configuration guides</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🌐 External Resources</h3>
                        <ul>
                          <li>Link to GitHub repositories</li>
                          <li>Reference external docs</li>
                          <li>Community resources</li>
                          <li>Learning materials</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>

            {/* Meta Example - RelatedResources linking to itself */}
            <RelatedResources
              title="🔗 Related Resources"
              description="Learn more about this component and explore other features:"
              links={[
                {
                  href: '/docs/core-systems/related-resources-component',
                  label: '📖 Component Documentation',
                  type: 'primary'
                },
                {
                  href: '/docs/core-systems',
                  label: '🏗️ Core Systems',
                  type: 'secondary'
                },
                {
                  href: '/demos',
                  label: '🎮 More Demos',
                  type: 'outline'
                }
              ]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
