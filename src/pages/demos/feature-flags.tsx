import React, { useState } from 'react';
import Layout from '@theme/Layout';
import FeatureComponent from '../../components/FeatureComponent';
import { Features } from '../../config/FeaturesConfig';
import RelatedResources from '../../components/RelatedResources';

/**
 * Feature Flags Component Demo
 * Demonstrates the FeatureComponent with conditional rendering based on feature flags
 */
export default function FeatureFlagsDemo(): React.JSX.Element {
  const [selectedFeature, setSelectedFeature] = useState<Features>(
    Features.ThemeSwitcher
  );

  const demoFeatures = [
    {
      key: Features.ThemeSwitcher,
      name: 'Theme Switcher',
      description: 'Dynamic theme switching functionality'
    },
    {
      key: Features.GiscusComments,
      name: 'Giscus Comments',
      description: 'GitHub Discussions-powered comments'
    },
    {
      key: Features.GitHubLinks,
      name: 'GitHub Links',
      description: 'GitHub repository links display'
    },
    {
      key: Features.VersionDisplay,
      name: 'Version Display',
      description: 'Application version information display'
    }
  ];

  return (
    <Layout
      title="Feature Flags Demo"
      description="Interactive demonstration of the FeatureComponent for conditional feature rendering"
    >
      <div className="container margin-top--md">
        <div className="row">
          <div className="col col--12">
            <header className="margin-bottom--lg">
              <div className="text--center">
                <h1 className="margin-bottom--sm">Feature Flags</h1>
                <p className="margin-bottom--none text--secondary">
                  Conditional component rendering based on configurable feature
                  flags flags
                </p>
              </div>
            </header>

            <main>
              {/* Live Demo */}
              <section className="margin-bottom--lg">
                <h2>🔴 Live Demo</h2>
                <div className="card shadow--md">
                  <div className="card__header">
                    <h3>Feature Flag Testing</h3>
                  </div>
                  <div className="card__body">
                    <div className="margin-bottom--md">
                      <label
                        htmlFor="feature-select"
                        className="margin-right--sm"
                      >
                        <strong>Select Feature to Test:</strong>
                      </label>
                      <select
                        id="feature-select"
                        value={selectedFeature.toString()}
                        onChange={(e) =>
                          setSelectedFeature(
                            parseInt(e.target.value) as Features
                          )
                        }
                        style={{
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--ifm-color-emphasis-300)'
                        }}
                      >
                        {demoFeatures.map((feature) => (
                          <option
                            key={feature.key}
                            value={feature.key.toString()}
                          >
                            {feature.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div
                      className="padding--md"
                      style={{
                        border: '1px solid var(--ifm-color-emphasis-300)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--ifm-background-surface-color)'
                      }}
                    >
                      <h4>Feature Component Output:</h4>
                      <FeatureComponent
                        feature={selectedFeature}
                        configData={{}}
                      >
                        {() => (
                          <div className="alert alert--success">
                            <h5>
                              ✅ Feature Enabled:{' '}
                              {
                                demoFeatures.find(
                                  (f) => f.key === selectedFeature
                                )?.name
                              }
                            </h5>
                            <p>
                              {
                                demoFeatures.find(
                                  (f) => f.key === selectedFeature
                                )?.description
                              }
                            </p>
                            <p>
                              This content is only visible when the feature flag
                              is enabled!
                            </p>
                          </div>
                        )}
                      </FeatureComponent>

                      <div className="margin-top--md">
                        <small
                          style={{ color: 'var(--ifm-color-emphasis-600)' }}
                        >
                          <strong>Note:</strong> If you don't see the green
                          success box above, the selected feature is disabled in
                          the configuration.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Configuration */}
              <section className="margin-bottom--lg">
                <h2>⚙️ Feature Flags Configuration</h2>
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h3>Features Configuration</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {'// config/Features.yml\n' +
                          'features:\n' +
                          '  sampleFeature:\n' +
                          '    enabled: true\n' +
                          "    description: 'A sample feature for demonstration'\n" +
                          '    rolloutPercentage: 100\n' +
                          "    environment: ['development', 'production']\n\n" +
                          '  betaFeature:\n' +
                          '    enabled: false\n' +
                          "    description: 'Experimental beta functionality'\n" +
                          '    rolloutPercentage: 25\n' +
                          "    environment: ['development']\n\n" +
                          '  newDashboard:\n' +
                          '    enabled: true\n' +
                          "    description: 'New dashboard interface'\n" +
                          '    rolloutPercentage: 75\n' +
                          "    environment: ['development', 'staging']"}
                      </code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Use Cases */}
              <section className="margin-bottom--lg">
                <h2>🎯 Common Use Cases</h2>
                <div className="row">
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🧪 A/B Testing</h3>
                        <ul>
                          <li>Test different UI components</li>
                          <li>Compare user engagement</li>
                          <li>Gradual feature rollout</li>
                          <li>Performance comparison</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🚀 Beta Features</h3>
                        <ul>
                          <li>Early feature access</li>
                          <li>User feedback collection</li>
                          <li>Risk mitigation</li>
                          <li>Incremental deployment</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🏗️ Development</h3>
                        <ul>
                          <li>Work-in-progress features</li>
                          <li>Environment-specific content</li>
                          <li>Debug information</li>
                          <li>Developer tools</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features */}
              <section className="margin-bottom--lg">
                <h2>✨ Key Features</h2>
                <div className="row">
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🎛️ Control & Flexibility</h3>
                        <ul>
                          <li>YAML-based configuration</li>
                          <li>Runtime feature toggling</li>
                          <li>Environment-specific settings</li>
                          <li>Percentage-based rollouts</li>
                          <li>Easy feature management</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>⚡ Performance & UX</h3>
                        <ul>
                          <li>Zero-overhead when disabled</li>
                          <li>No runtime feature detection</li>
                          <li>Clean component wrapping</li>
                          <li>Conditional rendering only</li>
                          <li>Build-time optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Usage Examples */}
              <section className="margin-bottom--lg">
                <h2>💻 Usage Examples</h2>

                <div className="card shadow--tl">
                  <div className="card__header">
                    <h3>Basic Feature Gating</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {"import FeatureComponent from '@site/src/components/FeatureComponent';\n\n" +
                          'export default function MyPage() {\n' +
                          '  return (\n' +
                          '    <Layout>\n' +
                          '      <h1>My Page</h1>\n' +
                          '      \n' +
                          '      {/* Always visible content */}\n' +
                          '      <p>This content is always visible</p>\n' +
                          '      \n' +
                          '      {/* Feature-gated content */}\n' +
                          "      <FeatureComponent feature='newDashboard'>\n" +
                          "        <div className='new-dashboard'>\n" +
                          '          <h2>New Dashboard (Beta)</h2>\n' +
                          '          <p>This is only visible when newDashboard feature is enabled</p>\n' +
                          '        </div>\n' +
                          '      </FeatureComponent>\n' +
                          '    </Layout>\n' +
                          '  );\n' +
                          '}'}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="card shadow--tl margin-top--md">
                  <div className="card__header">
                    <h3>Conditional Navigation</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {'// In navigation components\n' +
                          "import FeatureComponent from '@site/src/components/FeatureComponent';\n\n" +
                          'export default function Navigation() {\n' +
                          '  return (\n' +
                          '    <nav>\n' +
                          "      <Link to='/home'>Home</Link>\n" +
                          "      <Link to='/about'>About</Link>\n" +
                          '      \n' +
                          "      <FeatureComponent feature='betaFeatures'>\n" +
                          "        <Link to='/beta'>Beta Features</Link>\n" +
                          '      </FeatureComponent>\n' +
                          '      \n' +
                          "      <FeatureComponent feature='adminPanel'>\n" +
                          "        <Link to='/admin'>Admin Panel</Link>\n" +
                          '      </FeatureComponent>\n' +
                          '    </nav>\n' +
                          '  );\n' +
                          '}'}
                      </code>
                    </pre>
                  </div>
                </div>
              </section>

              <RelatedResources
                description="Learn more about feature flags and conditional rendering"
                links={[
                  {
                    href: '/docs/configuration/key-components#feature-flags',
                    label: '📖 Feature Flags Docs',
                    type: 'primary'
                  },
                  {
                    href: '/docs/advanced/development-workflow',
                    label: '🛠️ Development Workflow',
                    type: 'secondary'
                  },
                  {
                    href: '/demos',
                    label: '🎯 All Demos',
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
