import React from 'react';
import Layout from '@theme/Layout';
import GiscusComments from '../../components/GiscusComments';
import RelatedResources from '../../components/RelatedResources';

/**
 * Comments System Component Demo
 * Demonstrates the GiscusComments component for interactive discussions
 */
export default function CommentsDemo(): React.JSX.Element {
  return (
    <Layout
      title="Comments System Demo"
      description="Interactive demonstration of the GiscusComments component powered by GitHub Discussions"
    >
      <div className="container margin-top--md">
        <div className="row">
          <div className="col col--12">
            <header className="margin-bottom--lg">
              <div className="text--center">
                <h1 className="margin-bottom--sm">Comments System</h1>
                <p className="margin-bottom--none text--secondary">
                  GitHub Discussions-powered comments for enhanced user
                  engagement
                </p>
              </div>
            </header>

            <main>
              {/* Live Demo */}
              <section className="margin-bottom--lg">
                <h2>🔴 Live Demo</h2>
                <div className="card shadow--md">
                  <div className="card__header">
                    <h3>Interactive Comment System</h3>
                    <p>
                      Comments are powered by GitHub Discussions and load below:
                    </p>
                  </div>
                  <div className="card__body">
                    <GiscusComments />
                  </div>
                </div>
              </section>

              {/* Configuration */}
              <section className="margin-bottom--lg">
                <h2>⚙️ Giscus Configuration</h2>
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h3>Setup Requirements</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {'// config/giscus.yml\n' +
                          "repo: 'your-username/your-repo'\n" +
                          "repoId: 'R_YOUR_REPO_ID'\n" +
                          "category: 'General'\n" +
                          "categoryId: 'DIC_YOUR_CATEGORY_ID'\n" +
                          "mapping: 'pathname'  # or 'url', 'title', etc.\n" +
                          'reactionsEnabled: true\n' +
                          'emitMetadata: false\n' +
                          "inputPosition: 'bottom'  # or 'top'\n" +
                          "theme: 'preferred_color_scheme'\n" +
                          "lang: 'en'\n" +
                          "loading: 'lazy'"}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="card shadow--tl margin-top--md">
                  <div className="card__header">
                    <h3>GitHub Repository Setup</h3>
                  </div>
                  <div className="card__body">
                    <ol>
                      <li>
                        <strong>Enable Discussions:</strong> Go to your
                        repository Settings → Features → Discussions
                      </li>
                      <li>
                        <strong>Install Giscus App:</strong> Visit{' '}
                        <a
                          href="https://github.com/apps/giscus"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          giscus app
                        </a>{' '}
                        and install it for your repository
                      </li>
                      <li>
                        <strong>Get Configuration:</strong> Use{' '}
                        <a
                          href="https://giscus.app"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          giscus.app
                        </a>{' '}
                        to generate your config
                      </li>
                      <li>
                        <strong>Configure Template:</strong> Update your{' '}
                        <code>config/giscus.yml</code> with the generated values
                      </li>
                    </ol>
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
                        <h3>🗣️ Rich Discussions</h3>
                        <ul>
                          <li>Markdown support</li>
                          <li>Emoji reactions</li>
                          <li>Threaded replies</li>
                          <li>Code syntax highlighting</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🔒 Authentication</h3>
                        <ul>
                          <li>GitHub OAuth login</li>
                          <li>No separate accounts</li>
                          <li>Spam protection</li>
                          <li>Moderation tools</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🎨 Customization</h3>
                        <ul>
                          <li>Theme integration</li>
                          <li>Custom styling</li>
                          <li>Multiple languages</li>
                          <li>Responsive design</li>
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
                    <h3>Blog Post Integration</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {'// In your blog post template\n' +
                          "import GiscusComments from '@site/src/components/GiscusComments';\n\n" +
                          'export default function BlogPost({ content, metadata }) {\n' +
                          '  return (\n' +
                          '    <Layout>\n' +
                          '      <article>\n' +
                          '        <h1>{metadata.title}</h1>\n' +
                          '        <div>{content}</div>\n' +
                          '        \n' +
                          '        {/* Comments section */}\n' +
                          "        <section className='margin-top--xl'>\n" +
                          '          <h2>Comments</h2>\n' +
                          '          <GiscusComments />\n' +
                          '        </section>\n' +
                          '      </article>\n' +
                          '    </Layout>\n' +
                          '  );\n' +
                          '}'}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="card shadow--tl margin-top--md">
                  <div className="card__header">
                    <h3>Documentation Pages</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {'// In MDX documentation\n' +
                          '---\n' +
                          'title: Your Documentation Page\n' +
                          '---\n\n' +
                          "import GiscusComments from '@site/src/components/GiscusComments';\n\n" +
                          '# Your Documentation Content\n\n' +
                          'Your documentation content here...\n\n' +
                          '## Questions and Feedback\n\n' +
                          '<GiscusComments />'}
                      </code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Mapping Options */}
              <section className="margin-bottom--lg">
                <h2>🗺️ Discussion Mapping</h2>
                <div className="card shadow--tl">
                  <div className="card__body">
                    <h3>Available Mapping Options</h3>
                    <div className="row">
                      <div className="col col--6">
                        <ul>
                          <li>
                            <strong>pathname:</strong> Use page path
                            (recommended)
                          </li>
                          <li>
                            <strong>url:</strong> Use full URL
                          </li>
                          <li>
                            <strong>title:</strong> Use page title
                          </li>
                        </ul>
                      </div>
                      <div className="col col--6">
                        <ul>
                          <li>
                            <strong>og:title:</strong> Use OpenGraph title
                          </li>
                          <li>
                            <strong>specific:</strong> Use specific term
                          </li>
                          <li>
                            <strong>number:</strong> Use discussion number
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <RelatedResources
                description="Learn more about the comments system and GitHub Discussions"
                links={[
                  {
                    href: '/docs/core-systems/comment-system',
                    label: '📖 Comment System Docs',
                    type: 'primary'
                  },
                  {
                    href: 'https://giscus.app',
                    label: '⚙️ Giscus Configuration',
                    type: 'secondary',
                    external: true
                  },
                  {
                    href: 'https://docs.github.com/discussions',
                    label: '💬 GitHub Discussions',
                    type: 'outline',
                    external: true
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
