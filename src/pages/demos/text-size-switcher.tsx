import React from 'react';
import Layout from '@theme/Layout';
import RelatedResources from '../../components/RelatedResources';

/**
 * Text Size Switcher Component Demo
 * Demonstrates the TextSizeSwitcher component for accessibility controls
 */
export default function TextSizeSwitcherDemo(): React.JSX.Element {
  return (
    <Layout
      title="Text Size Switcher Demo"
      description="Interactive demonstration of the TextSizeSwitcher component for accessibility controls"
    >
      <div className="container margin-top--md">
        <div className="row">
          <div className="col col--12">
            <header className="margin-bottom--lg">
              <div className="text--center">
                <h1 className="margin-bottom--sm">Text Size Switcher</h1>
                <p className="margin-bottom--none text--secondary">
                  Accessibility-focused text size controls for improved user
                  experience
                </p>
              </div>
            </header>

            <main>
              {/* Live Demo */}
              <section className="margin-bottom--lg">
                <h2>🔴 Live Demo</h2>
                <div className="card shadow--md">
                  <div className="card__header">
                    <h3>Interactive Text Size Controls</h3>
                  </div>
                  <div className="card__body">
                    <p>
                      Use the text size switcher in the navbar (top right) to
                      adjust the text size for better readability. Watch how the
                      text size changes affect this demo content:
                    </p>
                    <div
                      className="padding--md margin-top--md"
                      style={{
                        border: '1px solid var(--ifm-color-emphasis-300)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--ifm-background-surface-color)'
                      }}
                    >
                      <h4>Sample Content</h4>
                      <p>
                        This is sample text to demonstrate the text size
                        switcher functionality. Use the text size controls in
                        the navbar to increase or decrease the text size. This
                        helps users with visual impairments or those who prefer
                        different reading sizes.
                      </p>
                      <p>
                        <strong>Accessibility Features:</strong> The text size
                        changes apply to the entire document and persist across
                        page navigation for a consistent user experience.
                      </p>
                      <ul>
                        <li>Small text size for compact viewing</li>
                        <li>Medium text size (default) for normal reading</li>
                        <li>Large text size for improved readability</li>
                        <li>Extra large text size for accessibility needs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Text Size Options */}
              <section className="margin-bottom--lg">
                <h2>📏 Available Text Sizes</h2>
                <div className="row">
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>Size Options</h3>
                        <ul>
                          <li>
                            <strong>Small:</strong> 14px base font size
                          </li>
                          <li>
                            <strong>Medium:</strong> 16px base font size
                            (default)
                          </li>
                          <li>
                            <strong>Large:</strong> 18px base font size
                          </li>
                          <li>
                            <strong>Extra Large:</strong> 20px base font size
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>Persistence</h3>
                        <ul>
                          <li>Setting saved to localStorage</li>
                          <li>Maintained across page reloads</li>
                          <li>Consistent across the entire site</li>
                          <li>Immediate visual feedback</li>
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
                        <h3>♿ Accessibility</h3>
                        <ul>
                          <li>WCAG 2.1 compliant</li>
                          <li>Keyboard navigation support</li>
                          <li>Screen reader friendly</li>
                          <li>High contrast compatibility</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🎨 Visual Design</h3>
                        <ul>
                          <li>Clean button interface</li>
                          <li>Visual size indicators</li>
                          <li>Theme-aware styling</li>
                          <li>Responsive design</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>⚡ Performance</h3>
                        <ul>
                          <li>Lightweight component</li>
                          <li>CSS-based sizing</li>
                          <li>No external dependencies</li>
                          <li>Fast state changes</li>
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
                    <h3>Basic Integration</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {'// In your header or navbar\n' +
                          "import TextSizeSwitcher from '@site/src/components/TextSizeSwitcher';\n\n" +
                          'export default function Header() {\n' +
                          '  return (\n' +
                          '    <header>\n' +
                          '      <nav>\n' +
                          "        <div className='navbar__item'>\n" +
                          '          <TextSizeSwitcher />\n' +
                          '        </div>\n' +
                          '      </nav>\n' +
                          '    </header>\n' +
                          '  );\n' +
                          '}'}
                      </code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Related Resources */}
              <RelatedResources
                title="🔗 Related Resources"
                description="Learn more about accessibility features and text size controls"
                links={[
                  {
                    href: '/docs/configuration/key-components#text-size-switcher',
                    label: '📖 Component Docs',
                    type: 'primary'
                  },
                  {
                    href: 'https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html',
                    label: '♿ WCAG Guidelines',
                    type: 'secondary',
                    external: true
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
