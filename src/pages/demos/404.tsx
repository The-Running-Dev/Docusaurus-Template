import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import RelatedResources from '../../components/RelatedResources';

/**
 * 404 Error Page Demo
 * Provides links and information about the custom 404 error page
 */
export default function NotFoundDemo(): React.JSX.Element {
  const brokenLinks = [
    '/this-page-does-not-exist',
    '/random-broken-link',
    '/missing-page-example',
    '/broken-demo-link',
    '/non-existent-documentation'
  ];

  return (
    <Layout
      title="404 Error Page Demo"
      description="Explore our custom 404 error page with interactive features and humorous content"
    >
      <div className="container margin-top--md">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <header className="text--center margin-bottom--lg">
              <h1 className="margin-bottom--sm">🎪 404 Error Page</h1>
              <p className="margin-bottom--none text--secondary">
                Our custom 404 page turns missing pages into an entertaining
                experience with interactive elements and humor.
              </p>
            </header>

            <main>
              {/* Interactive Demo Section */}
              <section className="margin-bottom--lg">
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h2>🚀 Try the 404 Page</h2>
                  </div>
                  <div className="card__body">
                    <p>
                      Click any of these broken links to experience our custom
                      404 page:
                    </p>

                    <div className="button-group button-group--block margin-top--lg">
                      {brokenLinks.map((link, index) => (
                        <Link
                          key={index}
                          to={link}
                          className="button button--outline"
                        >
                          🔗 Broken Link #{index + 1}
                        </Link>
                      ))}
                    </div>

                    <div className="margin-top--lg">
                      <div className="admonition admonition-info">
                        <div className="admonition-heading">
                          <h5>💡 What You'll See</h5>
                        </div>
                        <div className="admonition-content">
                          <p>Our 404 page includes:</p>
                          <ul>
                            <li>🌈 Animated rainbow "404" display</li>
                            <li>
                              🎭 Rotating excuse generator (updates every 3
                              seconds)
                            </li>
                            <li>🐱 Interactive cat facts spinner</li>
                            <li>🚀 Emergency navigation buttons</li>
                            <li>📊 Fun fake statistics</li>
                            <li>🛠️ Absurd troubleshooting tips</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features Overview */}
              <section className="margin-bottom--lg">
                <h2>🎨 404 Page Features</h2>
                <div className="row">
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🎭 Interactive Elements</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>
                            <strong>Excuse Generator:</strong> 15+ humorous
                            explanations that rotate automatically every 3
                            seconds
                          </li>
                          <li>
                            <strong>Cat Facts Spinner:</strong> Click the button
                            to get random cat facts with spin animation
                          </li>
                          <li>
                            <strong>Emergency Navigation:</strong> Quick links
                            to Home, Docs, and Demos
                          </li>
                          <li>
                            <strong>Fun Statistics:</strong> Randomized counters
                            for pages found, robots consulted, and coffee
                            consumed
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>💎 Design Features</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>
                            <strong>Rainbow Animation:</strong> Multi-color
                            gradient background that shifts continuously
                          </li>
                          <li>
                            <strong>Responsive Layout:</strong> Works perfectly
                            on all device sizes
                          </li>
                          <li>
                            <strong>Smooth Transitions:</strong> CSS animations
                            with proper easing
                          </li>
                          <li>
                            <strong>Theme Integration:</strong> Uses site's
                            design tokens and respects dark/light mode
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Content Examples */}
              <section className="margin-bottom--lg">
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h2>📝 Sample Content</h2>
                  </div>
                  <div className="card__body">
                    <h3>🎭 Example Excuses</h3>
                    <div className="row margin-bottom--lg">
                      <div className="col col--6">
                        <ul>
                          <li>
                            🐕 A dog ate the page (it was very tasty HTML)
                          </li>
                          <li>🧙‍♂️ A wizard turned it into a toad</li>
                          <li>
                            🛸 Aliens abducted it for their intergalactic
                            library
                          </li>
                          <li>
                            🍕 It went out to get pizza and never came back
                          </li>
                        </ul>
                      </div>
                      <div className="col col--6">
                        <ul>
                          <li>🤖 A robot uprising deleted it out of spite</li>
                          <li>
                            🦄 A unicorn needed it to practice magic tricks
                          </li>
                          <li>🎪 It ran away to join the circus</li>
                          <li>🧟‍♂️ Zombies ate it (they prefer semantic HTML)</li>
                        </ul>
                      </div>
                    </div>

                    <h3>🐱 Example Cat Facts</h3>
                    <ul>
                      <li>
                        Cats spend 70% of their lives sleeping, which explains
                        why your page is taking a nap.
                      </li>
                      <li>
                        A group of cats is called a 'clowder,' which is also
                        what we call our development team.
                      </li>
                      <li>
                        Cats can't taste sweetness, unlike this bitter 404
                        experience.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Technical Implementation */}
              <section className="margin-bottom--lg">
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h2>🔧 Technical Implementation</h2>
                  </div>
                  <div className="card__body">
                    <h3>📁 File Locations</h3>
                    <ul>
                      <li>
                        <code>src/pages/404.tsx</code> - Custom 404 page
                        component
                      </li>
                      <li>
                        <code>src/theme/NotFound/index.tsx</code> - Docusaurus
                        NotFound override
                      </li>
                    </ul>

                    <h3>⚙️ Key Features</h3>
                    <ul>
                      <li>
                        <strong>Auto-rotating content:</strong> Uses React
                        useEffect with setInterval
                      </li>
                      <li>
                        <strong>CSS animations:</strong> Keyframe animations for
                        rainbow effect
                      </li>
                      <li>
                        <strong>State management:</strong> React hooks for
                        interactive elements
                      </li>
                      <li>
                        <strong>Responsive design:</strong> CSS Grid and Flexbox
                        layouts
                      </li>
                    </ul>

                    <h3>🎨 Customization</h3>
                    <div className="admonition admonition-tip">
                      <div className="admonition-heading">
                        <h5>💡 Easy to Customize</h5>
                      </div>
                      <div className="admonition-content">
                        <ul>
                          <li>
                            Add new excuses by extending the excuses array
                          </li>
                          <li>
                            Change animation timing by modifying useEffect
                            intervals
                          </li>
                          <li>Update cat facts with your own content</li>
                          <li>Customize colors using CSS custom properties</li>
                          <li>
                            Modify navigation links for your site structure
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Call to Action */}
              <RelatedResources
                title="🎪 Ready to Experience the Magic?"
                description="Click any broken link above to see our custom 404 page in
                    action, or visit a non-existent URL manually!"
                links={[
                  {
                    href: '/docs/core-systems/404-error-page',
                    label: '📖 404 Page Documentation',
                    type: 'primary'
                  },
                  {
                    href: '/docs/core-systems/404-error-page',
                    label: '🚀 Experience the 404 Page',
                    type: 'secondary'
                  },
                  {
                    href: '/demos',
                    label: '📖 Read the Documentation',
                    type: 'outline'
                  }
                ]}
              />
            </main>

            {/* Related Resources */}
            <RelatedResources
              title="🔗 Related Resources"
              description="Learn more about error handling and user experience:"
              links={[
                {
                  href: '/docs/core-systems/404-error-page',
                  label: '📖 404 Page Documentation',
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
