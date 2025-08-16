import React from 'react';
import Layout from '@theme/Layout';
import ReaderMode from '../../components/ReaderMode';
import RelatedResources from '../../components/RelatedResources';

/**
 * Reader Mode Component Demo
 * Demonstrates the ReaderMode component for clean reading experience
 */
export default function ReaderModeDemo(): React.JSX.Element {
  return (
    <Layout
      title="Reader Mode Demo"
      description="Interactive demonstration of the ReaderMode component for clean reading experience"
    >
      <div className="container margin-top--md">
        <div className="row">
          <div className="col col--12">
            <header className="margin-bottom--lg">
              <div className="text--center">
                <h1 className="margin-bottom--sm">Reader Mode</h1>
                <p className="margin-bottom--none text--secondary">
                  Clean, distraction-free reading experience with customizable
                  settings
                </p>
              </div>
            </header>

            <main>
              {/* Live Demo */}
              <section className="margin-bottom--lg">
                <h2>🔴 Live Demo</h2>
                <div className="card shadow--md">
                  <div className="card__header">
                    <h3>Reader Mode Toggle</h3>
                  </div>
                  <div className="card__body">
                    <div className="margin-bottom--md">
                      <ReaderMode />
                    </div>
                    <div
                      className="padding--md"
                      style={{
                        border: '1px solid var(--ifm-color-emphasis-300)',
                        borderRadius: '8px'
                      }}
                    >
                      <h4>Sample Article Content</h4>
                      <p>
                        This is sample article content to demonstrate the reader
                        mode functionality. When reader mode is activated,
                        distracting elements are hidden or minimized, and the
                        text is optimized for comfortable reading.
                      </p>
                      <p>
                        <strong>Enhanced Reading Experience:</strong> Reader
                        mode adjusts typography, spacing, and contrast to reduce
                        eye strain and improve focus on the content.
                      </p>
                      <blockquote>
                        "The best reading experience removes all barriers
                        between the reader and the content, allowing ideas to
                        flow naturally and understanding to deepen."
                      </blockquote>
                      <h5>Key Benefits:</h5>
                      <ul>
                        <li>Reduced visual clutter and distractions</li>
                        <li>Optimized typography and line spacing</li>
                        <li>Improved contrast for better readability</li>
                        <li>Consistent reading experience across devices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Reader Mode Features */}
              <section className="margin-bottom--lg">
                <h2>📖 Reader Mode Features</h2>
                <div className="row">
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>Visual Enhancements</h3>
                        <ul>
                          <li>Optimized font selection</li>
                          <li>Increased line height for readability</li>
                          <li>Improved text contrast</li>
                          <li>Reduced sidebar and navigation</li>
                          <li>Clean content focus</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>User Experience</h3>
                        <ul>
                          <li>One-click activation</li>
                          <li>Setting persistence</li>
                          <li>Smooth transitions</li>
                          <li>Mobile-friendly design</li>
                          <li>Keyboard shortcuts support</li>
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
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🎯 Focus Mode</h3>
                        <ul>
                          <li>Distraction elimination</li>
                          <li>Content-first approach</li>
                          <li>Minimal UI elements</li>
                          <li>Enhanced concentration</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>📱 Responsive Design</h3>
                        <ul>
                          <li>Mobile-optimized layout</li>
                          <li>Touch-friendly controls</li>
                          <li>Adaptive typography</li>
                          <li>Cross-device consistency</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>⚙️ Customization</h3>
                        <ul>
                          <li>Theme integration</li>
                          <li>Personal preferences</li>
                          <li>Configurable settings</li>
                          <li>State persistence</li>
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
                    <h3>Implementation</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {'// In your article or blog layout\n' +
                          "import ReaderMode from '@site/src/components/ReaderMode';\n\n" +
                          'export default function ArticlePage() {\n' +
                          '  return (\n' +
                          '    <Layout>\n' +
                          '      <article>\n' +
                          "        <div className='article-controls'>\n" +
                          '          <ReaderMode />\n' +
                          '        </div>\n' +
                          "        <div className='article-content'>\n" +
                          '          {/* Your article content */}\n' +
                          '        </div>\n' +
                          '      </article>\n' +
                          '    </Layout>\n' +
                          '  );\n' +
                          '}'}
                      </code>
                    </pre>
                  </div>
                </div>
              </section>

              <RelatedResources
                description="Learn more about reader mode and content optimization"
                links={[
                  {
                    href: '/docs/configuration/key-components#reader-mode',
                    label: '📖 Component Docs',
                    type: 'primary'
                  },
                  {
                    href: '/demos/text-size-switcher',
                    label: '📏 Text Size Switcher',
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
