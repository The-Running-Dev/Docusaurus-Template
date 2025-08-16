import React from 'react';
import Layout from '@theme/Layout';
import RelatedResources from '../../components/RelatedResources';

/**
 * Portfolio Component Demo
 * Demonstrates the Portfolio component with project showcase and filtering
 */
export default function PortfolioDemo(): React.JSX.Element {
  return (
    <Layout
      title="Portfolio Component Demo"
      description="Interactive demonstration of the Portfolio component for showcasing projects and work"
    >
      <div className="container margin-top--md">
        <div className="row">
          <div className="col col--12">
            <header className="margin-bottom--lg">
              <div className="text--center">
                <h1 className="margin-bottom--sm">Portfolio Component</h1>
                <p className="margin-bottom--none text--secondary">
                  Showcase projects, skills, and professional work with an
                  interactive portfolio display
                </p>
              </div>
            </header>

            <main>
              {/* Live Demo */}
              <section className="margin-bottom--lg">
                <h2>🔴 Live Demo</h2>
                <div className="alert alert--success" role="alert">
                  <strong>🎯 Live Portfolio Available!</strong> The interactive
                  portfolio is running live at{' '}
                  <a href="/portfolio" rel="noopener noreferrer">
                    <strong>/portfolio</strong>
                  </a>
                  . Visit the live page to explore the full portfolio experience
                  with real data and dynamic features.
                </div>
              </section>

              {/* Configuration */}
              <section className="margin-bottom--lg">
                <h2>⚙️ Portfolio Configuration</h2>
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h3>Data Structure</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {'// config/portfolioData.yml\n' +
                          'projects:\n' +
                          '  - id: project-1\n' +
                          '    title: Modern Web Application\n' +
                          '    description: Full-stack application with React and Node.js\n' +
                          '    category: Web Development\n' +
                          '    technologies: [React, TypeScript, Node.js, MongoDB]\n' +
                          '    image: /img/projects/project1.jpg\n' +
                          '    links:\n' +
                          '      - type: demo\n' +
                          '        url: https://demo.example.com\n' +
                          '      - type: github\n' +
                          '        url: https://github.com/user/project\n\n' +
                          'categories:\n' +
                          '  - Web Development\n' +
                          '  - Mobile Apps\n' +
                          '  - Data Science\n' +
                          '  - Machine Learning'}
                      </code>
                    </pre>
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
                        <h3>🎯 Project Filtering</h3>
                        <ul>
                          <li>Category-based filtering</li>
                          <li>Technology stack search</li>
                          <li>Interactive buttons</li>
                          <li>Real-time results</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🖼️ Visual Display</h3>
                        <ul>
                          <li>Project thumbnails</li>
                          <li>Technology badges</li>
                          <li>Responsive grid layout</li>
                          <li>Hover animations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🔗 Project Links</h3>
                        <ul>
                          <li>Demo links</li>
                          <li>Source code access</li>
                          <li>Documentation</li>
                          <li>External resources</li>
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
                    <h3>Basic Implementation</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {'// In your portfolio page\n' +
                          "import Portfolio from '@site/src/components/Portfolio';\n\n" +
                          'export default function PortfolioPage() {\n' +
                          '  return (\n' +
                          "    <Layout title='My Portfolio'>\n" +
                          "      <div className='container'>\n" +
                          '        <h1>My Projects</h1>\n' +
                          '        <Portfolio />\n' +
                          '      </div>\n' +
                          '    </Layout>\n' +
                          '  );\n' +
                          '}'}
                      </code>
                    </pre>
                  </div>
                </div>
              </section>

              <RelatedResources
                description="Experience the live portfolio and learn about configuration"
                links={[
                  {
                    href: '/portfolio',
                    label: '🎯 Live Portfolio',
                    type: 'primary'
                  },
                  {
                    href: '/docs/configuration/key-components#portfolio-component',
                    label: '📖 Portfolio Configuration',
                    type: 'secondary'
                  },
                  {
                    href: '/demos',
                    label: '🎯 All Demos',
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
