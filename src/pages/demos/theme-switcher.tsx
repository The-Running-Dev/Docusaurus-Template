import React, { useState } from 'react';
import Layout from '@theme/Layout';
import RelatedResources from '../../components/RelatedResources';

/**
 * Theme Switcher Demo Page
 * Demonstrates the configurable theme switching system with 12+ themes
 */
export default function ThemeSwitcherDemo(): React.JSX.Element {
  const [selectedTheme, setSelectedTheme] = useState<string>('default');

  const themeInfo = {
    default: {
      name: 'Default Theme',
      description:
        'The standard Docusaurus theme with professional blue accents',
      primaryColor: '#2e8555'
    },
    blue: {
      name: 'Professional Blue',
      description: 'Clean blue theme for corporate and professional sites',
      primaryColor: '#1976d2'
    },
    purple: {
      name: 'Creative Purple',
      description: 'Vibrant purple theme for creative and artistic projects',
      primaryColor: '#7c4dff'
    },
    sunset: {
      name: 'Warm Sunset',
      description: 'Warm orange and yellow gradient theme',
      primaryColor: '#ff6b35'
    },
    forest: {
      name: 'Nature Forest',
      description: 'Calm green theme inspired by nature',
      primaryColor: '#2e7d32'
    },
    'material-indigo': {
      name: 'Material Indigo',
      description: 'Google Material Design indigo theme',
      primaryColor: '#3f51b5'
    },
    'material-pink': {
      name: 'Material Pink',
      description: 'Google Material Design pink theme',
      primaryColor: '#e91e63'
    },
    'material-teal': {
      name: 'Material Teal',
      description: 'Google Material Design teal theme',
      primaryColor: '#009688'
    },
    'material-amber': {
      name: 'Material Amber',
      description: 'Google Material Design amber theme',
      primaryColor: '#ffc107'
    },
    'material-red': {
      name: 'Material Red',
      description: 'Google Material Design red theme',
      primaryColor: '#f44336'
    },
    agent: {
      name: 'Agent Theme',
      description: 'Dark, sleek theme for tech and development projects',
      primaryColor: '#00bcd4'
    },
    nuke: {
      name: 'High Contrast',
      description: 'High contrast theme for accessibility',
      primaryColor: '#ff0000'
    }
  };

  return (
    <Layout
      title="Theme Switcher Demo"
      description="Interactive demonstration of the configurable theme switching system"
    >
      <div className="container margin-top--md theme-switcher-demo-page">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <header className="text--center margin-bottom--lg">
              <h1 className="margin-bottom--sm">🎨 Theme Switcher</h1>
              <p className="margin-bottom--none text--secondary">
                Experience the dynamic theme switching system with 12+
                professionally designed themes. Changes persist across page
                loads and sync with system preferences.
              </p>
            </header>

            <main>
              {/* Live Theme Switcher */}
              <section className="margin-bottom--lg">
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h2>🔄 Interactive Theme Switcher</h2>
                  </div>
                  <div className="card__body">
                    <p>
                      Use the theme switcher in the navbar (top right) to change
                      the site's appearance in real-time. Watch how the theme
                      changes affect the entire site:
                    </p>
                    <div className="margin-top--lg text--center">
                      <em>👆 Use the theme switcher in the navbar above</em>
                    </div>
                  </div>
                </div>
              </section>

              {/* Theme Gallery */}
              <section className="margin-bottom--lg">
                <h2>🎭 Available Themes</h2>
                <p>Click on any theme preview to see it applied to the site:</p>

                <div className="row margin-top--lg">
                  {Object.entries(themeInfo).map(([themeId, info]) => (
                    <div key={themeId} className="col col--4 margin-bottom--lg">
                      <div
                        className={`card shadow--tl ${selectedTheme === themeId ? 'card--selected' : ''}`}
                        style={{
                          cursor: 'pointer',
                          border:
                            selectedTheme === themeId
                              ? '2px solid var(--ifm-color-primary)'
                              : '1px solid var(--ifm-color-emphasis-300)'
                        }}
                        onClick={() => setSelectedTheme(themeId)}
                      >
                        <div className="card__body">
                          <div
                            style={{
                              width: '100%',
                              height: '40px',
                              backgroundColor: info.primaryColor,
                              borderRadius: '4px',
                              marginBottom: '1rem'
                            }}
                          />
                          <h3 className="margin-bottom--sm">{info.name}</h3>
                          <p className="margin-bottom--none">
                            {info.description}
                          </p>
                          <small
                            style={{ color: 'var(--ifm-color-emphasis-600)' }}
                          >
                            Primary: {info.primaryColor}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Technical Features */}
              <section className="margin-bottom--lg">
                <h2>⚙️ Technical Features</h2>
                <div className="row">
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🔧 Configuration</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>
                            ✅ <strong>Persistent Storage:</strong> Theme
                            preference saved in localStorage
                          </li>
                          <li>
                            ✅ <strong>System Integration:</strong> Respects
                            system dark/light mode preferences
                          </li>
                          <li>
                            ✅ <strong>Dynamic Loading:</strong> CSS themes
                            loaded on-demand
                          </li>
                          <li>
                            ✅ <strong>Schema Validation:</strong> Theme
                            configuration validated with Zod
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🎯 Usage Patterns</h3>
                      </div>
                      <div className="card__body">
                        <ul>
                          <li>
                            ✅ <strong>Navbar Integration:</strong> Available in
                            site navigation
                          </li>
                          <li>
                            ✅ <strong>Responsive Design:</strong> Works on all
                            device sizes
                          </li>
                          <li>
                            ✅ <strong>Accessibility:</strong> High contrast
                            options available
                          </li>
                          <li>
                            ✅ <strong>Customizable:</strong> Easy to add new
                            themes
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Implementation Example */}
              <section className="margin-bottom--lg">
                <h2>💻 Implementation</h2>
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h3>Basic Usage</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>{`import ThemeSwitcher from '@site/src/components/ThemeSwitcher';

// Simple usage - renders dropdown with all themes
<ThemeSwitcher />

// In navbar (automatic integration)
// The component is automatically available in navbar items`}</code>
                    </pre>
                  </div>
                </div>

                <div className="card shadow--tl margin-top--md">
                  <div className="card__header">
                    <h3>Theme Configuration (themes.yml)</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>{`defaultTheme: "default"
themes:
  - id: "blue"
    name: "Professional Blue"
    cssFile: "blue.css"
  - id: "purple"
    name: "Creative Purple" 
    cssFile: "purple.css"
  # ... more themes`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              <RelatedResources
                links={[
                  {
                    href: '/docs/core-systems/theme-system',
                    label: '📖 Theme System Docs',
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
