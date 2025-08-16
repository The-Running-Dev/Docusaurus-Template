import React from 'react';
import Layout from '@theme/Layout';
import RelatedResources from '../../components/RelatedResources';

/**
 * CV Component Demo
 * Demonstrates the CV component with professional timeline and experience display
 */
export default function CVDemo(): React.JSX.Element {
  return (
    <Layout
      title="CV Component Demo"
      description="Interactive demonstration of the CV component with professional timeline display"
    >
      <div className="container margin-top--md">
        <div className="row">
          <div className="col col--12">
            <header className="margin-bottom--lg">
              <div className="text--center">
                <h1 className="margin-bottom--sm">CV Component</h1>
                <p className="margin-bottom--none text--secondary">
                  Professional CV and timeline display with experience,
                  education, and skills
                </p>
              </div>
            </header>

            <main>
              {/* Live Demo */}
              <section className="margin-bottom--lg">
                <h2>🔴 Live Demo</h2>
                <div className="alert alert--success" role="alert">
                  <strong>🎯 Live CV Available!</strong> The interactive
                  professional CV is running live at{' '}
                  <a href="/cv" rel="noopener noreferrer">
                    <strong>/cv</strong>
                  </a>
                  . Visit the live page to explore the complete CV experience
                  with professional timeline, skills, and experience display.
                </div>
              </section>

              {/* Data Structure */}
              <section className="margin-bottom--lg">
                <h2>📋 CV Data Structure</h2>
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h3>Configuration Format</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {'// config/cvData.yml\n' +
                          'experience:\n' +
                          '  - title: Senior Software Engineer\n' +
                          '    company: Tech Company Inc.\n' +
                          "    duration: '2022 - Present'\n" +
                          '    description: Lead development of scalable applications\n' +
                          '    technologies: [React, TypeScript, Node.js]\n\n' +
                          'education:\n' +
                          '  - degree: Master of Science in Computer Science\n' +
                          '    institution: University Name\n' +
                          "    year: '2020'\n" +
                          '    details: Focus on software engineering and AI\n\n' +
                          'skills:\n' +
                          '  - category: Frontend\n' +
                          '    items: [React, TypeScript, Next.js]\n' +
                          '  - category: Backend\n' +
                          '    items: [Node.js, Python, Java]'}
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
                        <h3>📅 Timeline View</h3>
                        <ul>
                          <li>Chronological experience</li>
                          <li>Visual timeline display</li>
                          <li>Duration highlighting</li>
                          <li>Responsive design</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🎓 Education Section</h3>
                        <ul>
                          <li>Degree information</li>
                          <li>Institution details</li>
                          <li>Graduation years</li>
                          <li>Additional notes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🛠️ Skills Display</h3>
                        <ul>
                          <li>Categorized skills</li>
                          <li>Technology stacks</li>
                          <li>Proficiency levels</li>
                          <li>Interactive badges</li>
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
                        {'// In your page or component\n' +
                          "import CV from '@site/src/components/CV';\n\n" +
                          'export default function AboutPage() {\n' +
                          '  return (\n' +
                          '    <Layout>\n' +
                          '      <CV />\n' +
                          '    </Layout>\n' +
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
                description="Experience the live CV and learn about configuration:"
                links={[
                  {
                    href: '/cv',
                    label: '🎯 Live CV',
                    type: 'primary'
                  },
                  {
                    href: '/docs/configuration/key-components#cv-component',
                    label: '📖 CV Configuration',
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
