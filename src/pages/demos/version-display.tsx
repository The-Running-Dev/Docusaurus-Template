import React, { useState } from 'react';
import Layout from '@theme/Layout';
import VersionDisplay from '../../components/VersionDisplay';
import RelatedResources from '../../components/RelatedResources';

/**
 * Version Display Demo Page
 * Demonstrates the dynamic version information system
 */
export default function VersionDisplayDemo(): React.JSX.Element {
  const [displayFormat, setDisplayFormat] = useState<
    'full' | 'short' | 'minimal'
  >('full');

  const versionExamples = {
    current: {
      version: '1.1.2',
      buildDate: new Date().toISOString().split('T')[0],
      gitCommit: 'a1b2c3d',
      environment: 'production'
    },
    development: {
      version: '1.2.0-beta.1',
      buildDate: new Date().toISOString().split('T')[0],
      gitCommit: 'f4e5d6c',
      environment: 'development'
    },
    custom: {
      version: '2024.08.15',
      buildDate: '2024-08-15',
      gitCommit: 'main',
      environment: 'staging',
      customLabel: 'Release Candidate'
    }
  };

  return (
    <Layout
      title="Version Display Demo"
      description="Interactive demonstration of the dynamic version information system"
    >
      <div className="container margin-top--md">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <header className="text--center margin-bottom--lg">
              <h1 className="margin-bottom--sm">🏷️ Version Display</h1>
              <p className="margin-bottom--none text--secondary">
                Dynamic version information display with build dates, Git
                commits, and environment indicators. Perfect for tracking
                releases, deployments, and development builds.
              </p>
            </header>

            <main>
              {/* Live Version Display */}
              <section className="margin-bottom--lg">
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h2>🔄 Live Version Display</h2>
                  </div>
                  <div className="card__body">
                    <p>
                      Current version information for this Docusaurus Template:
                    </p>
                    <div className="margin-top--lg">
                      <VersionDisplay />
                    </div>
                  </div>
                </div>
              </section>

              {/* Display Format Options */}
              <section className="margin-bottom--lg">
                <h2>🎨 Display Formats</h2>
                <div className="tabs">
                  <ul className="tabs__item-list" role="tablist">
                    <li
                      className={`tabs__item ${displayFormat === 'full' ? 'tabs__item--active' : ''}`}
                      role="tab"
                      onClick={() => setDisplayFormat('full')}
                    >
                      📋 Full Details
                    </li>
                    <li
                      className={`tabs__item ${displayFormat === 'short' ? 'tabs__item--active' : ''}`}
                      role="tab"
                      onClick={() => setDisplayFormat('short')}
                    >
                      📝 Short Format
                    </li>
                    <li
                      className={`tabs__item ${displayFormat === 'minimal' ? 'tabs__item--active' : ''}`}
                      role="tab"
                      onClick={() => setDisplayFormat('minimal')}
                    >
                      🏷️ Version Only
                    </li>
                  </ul>
                </div>

                <div className="margin-top--lg">
                  <div className="card shadow--tl">
                    <div className="card__body">
                      {displayFormat === 'full' && (
                        <div>
                          <h3>📋 Full Version Information</h3>
                          <p>
                            Shows complete version details including build
                            metadata:
                          </p>
                          <div className="margin-top--md">
                            <VersionDisplay />
                          </div>
                          <ul className="margin-top--md">
                            <li>✅ Version number with semantic versioning</li>
                            <li>✅ Build date and time</li>
                            <li>✅ Git commit hash</li>
                            <li>✅ Environment indicator</li>
                            <li>✅ Custom labels and badges</li>
                          </ul>
                        </div>
                      )}

                      {displayFormat === 'short' && (
                        <div>
                          <h3>📝 Short Format</h3>
                          <p>
                            Compact version display for space-constrained areas:
                          </p>
                          <div className="margin-top--md">
                            <VersionDisplay />
                          </div>
                          <ul className="margin-top--md">
                            <li>✅ Version number only</li>
                            <li>✅ Environment badge</li>
                            <li>✅ Hover tooltip with details</li>
                            <li>✅ Minimal space usage</li>
                          </ul>
                        </div>
                      )}

                      {displayFormat === 'minimal' && (
                        <div>
                          <h3>🏷️ Version Only</h3>
                          <p>Ultra-minimal display showing just the version:</p>
                          <div className="margin-top--md">
                            <VersionDisplay />
                          </div>
                          <ul className="margin-top--md">
                            <li>✅ Version number only</li>
                            <li>✅ Clean, text-only display</li>
                            <li>✅ Perfect for footers or headers</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Environment Examples */}
              <section className="margin-bottom--lg">
                <h2>🌍 Environment Examples</h2>
                <div className="row">
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🚀 Production</h3>
                      </div>
                      <div className="card__body">
                        <div className="version-example">
                          <span className="badge badge--success">
                            v{versionExamples.current.version}
                          </span>
                          <br />
                          <small>
                            Built: {versionExamples.current.buildDate}
                          </small>
                        </div>
                        <p className="margin-top--md">
                          Stable release with clean version numbers and release
                          indicators.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🧪 Development</h3>
                      </div>
                      <div className="card__body">
                        <div className="version-example">
                          <span className="badge badge--warning">
                            v{versionExamples.development.version}
                          </span>
                          <br />
                          <small>
                            Commit: {versionExamples.development.gitCommit}
                          </small>
                        </div>
                        <p className="margin-top--md">
                          Beta versions with commit hashes and development
                          indicators.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🎯 Custom</h3>
                      </div>
                      <div className="card__body">
                        <div className="version-example">
                          <span className="badge badge--info">
                            {versionExamples.custom.version}
                          </span>
                          <br />
                          <small>{versionExamples.custom.customLabel}</small>
                        </div>
                        <p className="margin-top--md">
                          Custom versioning schemes like date-based or semantic
                          release candidates.
                        </p>
                      </div>
                    </div>
                  </div>
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
                      <code>{`import VersionDisplay from '@site/src/components/VersionDisplay';

// Default display (uses version.yml configuration)
<VersionDisplay />

// Custom format
<VersionDisplay format="short" />
<VersionDisplay format="minimal" />

// In navbar (automatic integration)
// Component is available as navbar item`}</code>
                    </pre>
                  </div>
                </div>

                <div className="card shadow--tl margin-top--md">
                  <div className="card__header">
                    <h3>Version Configuration (version.yml)</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>{`version: "3.1.2"
buildDate: "2024-08-15"
gitCommit: "a1b2c3d"
environment: "production"
customLabel: "Stable Release"

# Optional display settings
showBuildDate: true
showGitCommit: true
showEnvironment: true
dateFormat: "YYYY-MM-DD"`}</code>
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
                            ✅ <strong>Build Pipeline:</strong> Auto-updated
                            during builds
                          </li>
                          <li>
                            ✅ <strong>Git Integration:</strong> Automatic
                            commit hash detection
                          </li>
                          <li>
                            ✅ <strong>Environment Detection:</strong> NODE_ENV
                            aware
                          </li>
                          <li>
                            ✅ <strong>Navbar Item:</strong> Available in
                            navigation
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
                            ✅ <strong>Theme Aware:</strong> Adapts to site
                            theme
                          </li>
                          <li>
                            ✅ <strong>Responsive:</strong> Works on all screen
                            sizes
                          </li>
                          <li>
                            ✅ <strong>Accessible:</strong> Screen reader
                            friendly
                          </li>
                          <li>
                            ✅ <strong>Customizable:</strong> Override styles
                            and formats
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
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>📱 Application Tracking</h3>
                        <ul>
                          <li>Mobile app version tracking</li>
                          <li>Web application releases</li>
                          <li>API version management</li>
                          <li>Deployment verification</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>📚 Documentation Sites</h3>
                        <ul>
                          <li>Documentation version sync</li>
                          <li>Content release tracking</li>
                          <li>Build verification</li>
                          <li>User support assistance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Related Resources */}
              <RelatedResources
                title="🔗 Related Resources"
                description="Learn more about version management and build automation:"
                links={[
                  {
                    href: '/docs/core-systems/version-display-system',
                    label: '📖 Version System Docs',
                    type: 'primary'
                  },
                  {
                    href: '/docs/core-systems/prebuild-system',
                    label: '🔄 Pre-build System',
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
