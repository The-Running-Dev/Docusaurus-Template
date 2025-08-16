import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { validateData } from '../../schemas';
import RelatedResources from '../../components/RelatedResources';

/**
 * Schema System Demo Page
 * Demonstrates the distributed schema validation system
 */
export default function SchemaSystemDemo(): React.JSX.Element {
  const [activeSchema, setActiveSchema] = useState<string>('themes');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [registeredSchemas, setRegisteredSchemas] = useState<string[]>([]);

  useEffect(() => {
    // Get all registered schemas on component mount
    // For demo purposes, using static list
    const schemas = [
      'themes',
      'navbarLinks',
      'badgeConfig',
      'github',
      'version',
      'projects',
      'Features'
    ];
    setRegisteredSchemas(schemas);
  }, []);

  const testData = {
    themes: {
      valid: {
        defaultTheme: 'light',
        themes: [
          { name: 'light', displayName: 'Light Mode', cssFile: 'light.css' },
          { name: 'dark', displayName: 'Dark Mode', cssFile: 'dark.css' }
        ]
      },
      invalid: {
        defaultTheme: 'light',
        themes: 'not-an-array' // Should be an array
      }
    },
    navbarLinks: {
      valid: {
        links: [
          { name: 'Home', path: '/', external: false },
          {
            name: 'GitHub',
            path: 'https://github.com/user/repo',
            external: true
          }
        ]
      },
      invalid: {
        links: [
          { name: 'Invalid Link' } // Missing required 'path' field
        ]
      }
    },
    badgeConfig: {
      valid: {
        templateVariables: {
          user: 'The-Running-Dev',
          repository: 'Docusaurus-Template'
        },
        badgeGroups: {
          build: [
            {
              name: 'Build Status',
              url: 'https://example.com',
              image: 'https://example.com/badge.svg'
            }
          ]
        }
      },
      invalid: {
        templateVariables: {
          user: 123 // Should be string
        }
      }
    }
  };

  const handleValidation = (schemaKey: string, isValid: boolean) => {
    const data = isValid
      ? testData[schemaKey]?.valid
      : testData[schemaKey]?.invalid;
    if (data) {
      try {
        const result = validateData(schemaKey, data);
        setValidationResult({
          schema: schemaKey,
          isValid: result,
          data: data,
          expectedValid: isValid
        });
      } catch (error) {
        setValidationResult({
          schema: schemaKey,
          isValid: false,
          data: data,
          expectedValid: isValid,
          error: error.message
        });
      }
    }
  };

  const schemaDescriptions = {
    themes: {
      name: '🎨 Theme System',
      description: 'Validates theme configuration and CSS file references',
      component: 'ThemeSwitcher'
    },
    navbarLinks: {
      name: '🔗 Navigation Links',
      description: 'Validates navigation menu structure and link definitions',
      component: 'NavBarLinks'
    },
    badgeConfig: {
      name: '🏷️ Badge Configuration',
      description: 'Validates badge templates and group definitions',
      component: 'Badges'
    },
    github: {
      name: '🐙 GitHub Integration',
      description: 'Validates GitHub repository configuration and API settings',
      component: 'GitHubInfo'
    },
    version: {
      name: '📋 Version Display',
      description: 'Validates version information and build metadata',
      component: 'VersionDisplay'
    },
    projects: {
      name: '📊 Projects Data',
      description: 'Validates project showcase data structure and metadata',
      component: 'Projects'
    },
    Features: {
      name: '🚩 Feature Flags',
      description: 'Validates feature flag configuration and settings',
      component: 'FeatureComponent'
    }
  };

  return (
    <Layout
      title="Schema System Demo"
      description="Interactive demonstration of the distributed schema validation system"
    >
      <div className="container margin-top--lg">
        <div className="row">
          <div className="col col--12">
            <header className="text--center margin-bottom--xl">
              <h1>🛡️ Schema System Demo</h1>
              <p className="hero__subtitle">
                Distributed component-owned schema validation with automatic
                registration and comprehensive error handling. Each component
                owns its schema for better maintainability and isolation.
              </p>
            </header>

            <main>
              {/* System Overview */}
              <section className="margin-bottom--lg">
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h2>📊 Schema System Overview</h2>
                  </div>
                  <div className="card__body">
                    <div className="row">
                      <div className="col col--8">
                        <h3>🔧 System Status</h3>
                        <ul>
                          <li>
                            ✅ <strong>Registered Schemas:</strong>{' '}
                            {registeredSchemas.length}
                          </li>
                          <li>
                            ✅ <strong>Architecture:</strong> Distributed
                            component-owned
                          </li>
                          <li>
                            ✅ <strong>Validation Library:</strong> Zod with
                            TypeScript
                          </li>
                          <li>
                            ✅ <strong>Auto-Registration:</strong> Global schema
                            registry
                          </li>
                        </ul>
                      </div>
                      <div className="col col--4">
                        <div className="alert alert--success">
                          <h4>🎯 Active Schemas</h4>
                          <ul style={{ marginBottom: 0 }}>
                            {registeredSchemas.map((schema) => (
                              <li key={schema} style={{ listStyle: 'none' }}>
                                ✅ {schema}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Interactive Schema Testing */}
              <section className="margin-bottom--lg">
                <h2>🧪 Interactive Schema Testing</h2>
                <div className="tabs">
                  <ul className="tabs__item-list" role="tablist">
                    {Object.entries(schemaDescriptions).map(([key, schema]) => (
                      <li
                        key={key}
                        className={`tabs__item ${activeSchema === key ? 'tabs__item--active' : ''}`}
                        role="tab"
                        onClick={() => setActiveSchema(key)}
                      >
                        {schema.name.split(' ')[0]} {key}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="margin-top--lg">
                  <div className="card shadow--tl">
                    <div className="card__header">
                      <h3>
                        {schemaDescriptions[activeSchema]?.name || activeSchema}
                      </h3>
                    </div>
                    <div className="card__body">
                      <p>{schemaDescriptions[activeSchema]?.description}</p>
                      <p>
                        <strong>Component:</strong>{' '}
                        {schemaDescriptions[activeSchema]?.component}
                      </p>

                      <div className="margin-top--lg">
                        <h4>Test Validation:</h4>
                        <div className="button-group">
                          <button
                            className="button button--primary"
                            onClick={() => handleValidation(activeSchema, true)}
                          >
                            ✅ Test Valid Data
                          </button>
                          <button
                            className="button button--danger"
                            onClick={() =>
                              handleValidation(activeSchema, false)
                            }
                          >
                            ❌ Test Invalid Data
                          </button>
                        </div>
                      </div>

                      {validationResult &&
                        validationResult.schema === activeSchema && (
                          <div className="margin-top--lg">
                            <div
                              className={`alert ${validationResult.isValid ? 'alert--success' : 'alert--danger'}`}
                            >
                              <h4>
                                {validationResult.isValid
                                  ? '✅ Validation Passed'
                                  : '❌ Validation Failed'}
                              </h4>
                              <p>
                                <strong>Expected:</strong>{' '}
                                {validationResult.expectedValid
                                  ? 'Valid'
                                  : 'Invalid'}
                                <br />
                                <strong>Result:</strong>{' '}
                                {validationResult.isValid ? 'Valid' : 'Invalid'}
                              </p>
                              {validationResult.error && (
                                <p>
                                  <strong>Error:</strong>{' '}
                                  {validationResult.error}
                                </p>
                              )}
                            </div>

                            <details className="margin-top--md">
                              <summary>📋 Test Data</summary>
                              <pre>
                                <code>
                                  {JSON.stringify(
                                    validationResult.data,
                                    null,
                                    2
                                  )}
                                </code>
                              </pre>
                            </details>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Architecture Overview */}
              <section className="margin-bottom--lg">
                <h2>🏗️ Distributed Architecture</h2>
                <div className="row">
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>📁 Component-Owned Schemas</h3>
                      </div>
                      <div className="card__body">
                        <p>Each component owns its validation schema:</p>
                        <pre>
                          <code>{`src/components/
├── ThemeSwitcher/
│   ├── index.tsx
│   └── schema.ts    ← Component schema
├── Projects/
│   ├── index.tsx
│   └── schema.ts    ← Component schema
└── .../`}</code>
                        </pre>
                        <h4>Benefits:</h4>
                        <ul>
                          <li>✅ Component isolation</li>
                          <li>✅ Better maintainability</li>
                          <li>✅ Easier testing</li>
                          <li>✅ Clear ownership</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--6">
                    <div className="card shadow--tl">
                      <div className="card__header">
                        <h3>🌐 Global Registry</h3>
                      </div>
                      <div className="card__body">
                        <p>Automatic schema registration and management:</p>
                        <pre>
                          <code>{`// src/schemas/index.ts
import { validateData } from './index';

// Auto-imports all schemas
const isValid = validateData(
  'themes', 
  themesData
);`}</code>
                        </pre>
                        <h4>Features:</h4>
                        <ul>
                          <li>✅ Auto-registration</li>
                          <li>✅ Centralized validation</li>
                          <li>✅ Error handling</li>
                          <li>✅ TypeScript integration</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Implementation Examples */}
              <section className="margin-bottom--lg">
                <h2>💻 Implementation Examples</h2>
                <div className="card shadow--tl">
                  <div className="card__header">
                    <h3>Creating a Component Schema</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {'// src/components/YourComponent/schema.ts\n' +
                          "import { z } from 'zod';\n\n" +
                          'export const componentSchema = z.object({\n' +
                          '  title: z.string(),\n' +
                          '  items: z.array(z.object({\n' +
                          '    id: z.string(),\n' +
                          '    name: z.string(),\n' +
                          '    optional: z.string().optional()\n' +
                          '  })),\n' +
                          '  settings: z.object({\n' +
                          '    enabled: z.boolean(),\n' +
                          '    maxItems: z.number().min(1).max(100)\n' +
                          '  })\n' +
                          '});\n\n' +
                          "export const schemaKey = 'yourComponent';"}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="card shadow--tl margin-top--md">
                  <div className="card__header">
                    <h3>Using Schema Validation</h3>
                  </div>
                  <div className="card__body">
                    <pre>
                      <code>
                        {'// In your component\n' +
                          "import { validateData } from '@site/src/schemas';\n\n" +
                          'export default function YourComponent(props) {\n' +
                          '  // Validate component data\n' +
                          "  const isValid = validateData('yourComponent', props.data);\n" +
                          '  \n' +
                          '  if (!isValid) {\n' +
                          "    return React.createElement('div', null, 'Invalid configuration');\n" +
                          '  }\n' +
                          '  \n' +
                          "  return React.createElement('div', null, 'Valid component content');\n" +
                          '}'}
                      </code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* System Benefits */}
              <section className="margin-bottom--lg">
                <h2>🎯 System Benefits</h2>
                <div className="row">
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🔧 Development</h3>
                        <ul>
                          <li>Type-safe validation</li>
                          <li>Better error messages</li>
                          <li>Automatic IntelliSense</li>
                          <li>Catch errors early</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🏗️ Architecture</h3>
                        <ul>
                          <li>Distributed ownership</li>
                          <li>Modular validation</li>
                          <li>Easy maintenance</li>
                          <li>Clear boundaries</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card shadow--tl">
                      <div className="card__body">
                        <h3>🚀 Production</h3>
                        <ul>
                          <li>Runtime validation</li>
                          <li>Graceful degradation</li>
                          <li>Error reporting</li>
                          <li>Configuration safety</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Related Resources */}
              <RelatedResources
                title="🔗 Related Resources"
                description="Learn more about the schema system and validation architecture:"
                links={[
                  {
                    href: '/docs/core-systems/schema-system',
                    label: '📖 Schema System Docs',
                    type: 'primary'
                  },
                  {
                    href: '/docs/core-systems/components-system',
                    label: '🧩 Components System',
                    type: 'secondary'
                  },
                  {
                    href: '/docs/advanced/migration-guide',
                    label: '📋 Migration Guide',
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
