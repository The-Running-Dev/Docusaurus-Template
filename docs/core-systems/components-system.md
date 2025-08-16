---
id: components-system
title: Components System
sidebar_position: 4
---

This documentation covers the core components and patterns used throughout the Docusaurus Template.

## Architecture Overview

The template follows a component-based architecture with several key patterns:

- **Feature Components** - Components that integrate with feature flags
- **Data-Driven Components** - Components that load and validate configuration data
- **Schema Validation** - All components use Zod schemas for data validation
- **Configuration Management** - Components use the unified configuration system

## Core Components

### FeatureComponent

A reusable base component that abstracts the common pattern of feature flag checking and data loading.

**Pattern:**

1. ✅ **Feature Flag Checking** - Uses `useFeatureFlag` to check if a feature is enabled
2. ✅ **Data Loading** - Uses `getData` to load configuration data
3. ✅ **Optional Processing** - Allows transformation of raw data before rendering
4. ✅ **Conditional Rendering** - Returns `null` if feature is disabled

**Basic Usage:**

```tsx
import FeatureComponent from '../FeatureComponent';
import { Features } from '../../config/FeaturesConfig';

<FeatureComponent feature={Features.MyFeature} configData={myConfigData}>
  {(config) => <div>{config.someProperty}</div>}
</FeatureComponent>;
```

**With Data Processing:**

```tsx
<FeatureComponent
  feature={Features.MyFeature}
  configData={myConfigData}
  processor={(config) => ({
    ...config,
    computedValue: processData(config.rawValue)
  })}
>
  {(processedData) => <div>{processedData.computedValue}</div>}
</FeatureComponent>
```

### ThemeSwitcher

Provides dynamic theme switching capabilities with 10 predefined themes.

**Features:**

- 10 predefined themes (blue, sunset, purple, material variants, etc.)
- Persists selection in localStorage
- Dynamic CSS injection with data attributes
- Default theme fallback to `src/css/custom.css`

**Schema:** `themes`

- `defaultTheme` (string, optional)
- `themes` (array of theme objects)

### NavBarLinks

Manages dynamic navbar link generation and rendering.

**Features:**

- Auto-generation from markdown files (excludes index.md)
- Configurable link positions and labels
- ARIA accessibility support

**Schema:** `navbarLinks`

- `links` (array with href, label, position, ariaLabel)

### Badges

GitHub project badge system with categorization and templating.

**Features:**

- Categorized badge groups (build, docs, demo, etc.)
- FontAwesome icon integration
- URL template variables for dynamic generation
- Support for multiple badge formats

**Schema:** `badgeConfig`

- `templateVariables` (record of string replacements)
- `badgeCategories` (array of categorized badge groups)

### GitHubInfo

GitHub integration component with comprehensive metadata and URL management.

**Features:**

- Repository information display
- GitHub API integration
- Multiple URL types (issues, discussions, releases, etc.)
- Avatar and contributor information

**Schema:** `github`

- Complete GitHub configuration with URLs and metadata

### VersionDisplay

Version information display with flexible styling options.

**Features:**

- Version string display (fallback to package.json)
- Clickable URLs
- Badge and custom styling options
- Tooltip support

**Schema:** `version`

- `version`, `href`, `prefix`, `badge`, `className`, `title`

### Projects

Project showcase component with categorization and filtering.

**Features:**

- Hierarchical project organization (categories → subcategories → projects)
- Tag-based filtering
- Last modified dates
- Project links and summaries

**Schema:** `projects`

- `categories` (array of project categories with subcategories and projects)

### GiscusComments

GitHub Discussions integration for page comments.

**Features:**

- Auto-adapts to Docusaurus dark/light theme
- Configurable via frontmatter (`comments: false`)
- GitHub repository integration
- Fallback UI for configuration issues

## Component Patterns

### Data Loading Pattern

All components follow this pattern:

```tsx
import { getData } from '../../data';
import { FeatureComponent } from '../FeatureComponent';
import { Features } from '../../config/FeaturesConfig';
import { configData } from '../../../data';

function MyComponent() {
  return (
    <FeatureComponent
      feature={Features.MyFeature}
      configData={configData}
      processor={processData}
    >
      {(data) => (
        // Render component with validated data
      )}
    </FeatureComponent>
  );
}
```

### Schema Integration

Each component exports its schema for validation:

```typescript
// Component schema file (e.g., src/components/MyComponent/schema.ts)
import { z } from 'zod';

export const MyComponentSchema = z.object({
  // Schema definition
});

export const componentSchema = MyComponentSchema;
export const schemaKey = 'myComponent';
```

### Feature Flag Integration

Components integrate with the global feature flag system:

```typescript
import { useFeatureFlag, Features } from '../../config/FeaturesConfig';

function MyComponent() {
  const isEnabled = useFeatureFlag(Features.MyFeature);

  if (!isEnabled) return null;

  // Component implementation
}
```

## Component Directory Structure

```
src/components/
├── ComponentName/
│   ├── ComponentName.tsx    ← Main component implementation
│   ├── ComponentName.css    ← Component-specific styles
│   ├── models.ts           ← TypeScript interfaces
│   ├── schema.ts           ← Zod validation schema
│   └── index.ts            ← Exports (component, models, schema)
└── ...
```

## Styling Conventions

### CSS Custom Properties

Components use CSS custom properties for theme integration:

```css
.my-component {
  color: var(--ifm-color-primary);
  background: var(--ifm-background-color);
}
```

### Theme-Aware Components

Components should adapt to Docusaurus themes:

```tsx
import { useColorMode } from '@docusaurus/theme-common';

function MyComponent() {
  const { colorMode } = useColorMode();

  return (
    <div className={`my-component ${colorMode}`}>{/* Component content */}</div>
  );
}
```

## Best Practices

1. **Always use FeatureComponent** for feature-flagged components
2. **Define schemas** for all data-driven components
3. **Use TypeScript interfaces** for type safety
4. **Follow naming conventions** for consistency
5. **Implement proper error handling** for data loading
6. **Make components theme-aware** when appropriate
7. **Export schemas** from component index files
8. **Use CSS custom properties** for theming
9. **Implement ARIA accessibility** where needed
10. **Document component APIs** with JSDoc comments
