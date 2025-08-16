---
id: api-reference
title: API Reference
sidebar_position: 2
---

This document provides comprehensive API reference for all components, configuration schemas, and interfaces in the Docusaurus Template v1.0.

## Configuration Management System (v1.0)

The template now includes a comprehensive configuration management system with the following new components:

### ConfigurationManager

Thread-safe configuration management with persistence and event notifications.

```typescript
class ConfigurationManager {
  constructor(options: ConfigurationManagerOptions = {});

  // Core methods
  async initialize(): Promise<void>;
  async registerSchema<T>(schema: ConfigurationSchema<T>): Promise<void>;
  async getValue<T>(key: string): Promise<T | null>;
  async setValue<T>(
    key: string,
    value: T,
    source?: 'user' | 'system' | 'external'
  ): Promise<boolean>;

  // Subscription methods
  subscribe<T>(key: string, callback: ConfigurationSubscription<T>): () => void;

  // Utility methods
  async getAllValues(): Promise<Record<string, ConfigValue>>;
  async reset(): Promise<void>;
  async reload(): Promise<void>;
}
```

#### ConfigurationManagerOptions

```typescript
interface ConfigurationManagerOptions {
  storage?: ConfigurationStorage;
  enablePersistence?: boolean;
  enableLogging?: boolean;
  validationMode?: 'strict' | 'lenient';
  namespace?: string;
}
```

### FeatureFlagManager

Advanced feature flag management extending the configuration system.

```typescript
class FeatureFlagManager {
  constructor(configManager: ConfigurationManager);

  // Initialization
  async initializeFromFeaturesConfig(
    featuresConfig: FeaturesConfig
  ): Promise<void>;

  // Feature flag operations
  async defineFlag(
    key: string,
    defaultEnabled: boolean,
    options?: Partial<FeatureFlag>
  ): Promise<void>;
  async isFeatureEnabled(key: string): Promise<boolean>;
  async setFeatureEnabled(key: string, enabled: boolean): Promise<boolean>;

  // State management
  async getFeatureFlagsState(): Promise<FeatureFlagState>;
  setEvaluationContext(key: string, value: ConfigValue): void;
  subscribeToFeature(
    key: string,
    callback: (enabled: boolean, flag?: FeatureFlag) => void
  ): () => void;
}
```

#### FeatureFlag Interface

```typescript
interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
  conditions?: Record<string, ConfigValue>;
}
```

### Configuration Storage

Flexible storage backend support:

```typescript
interface ConfigurationStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

#### Built-in Storage Implementations

- **LocalStorageConfigurationStorage**: Browser localStorage with namespace support
- **MemoryConfigurationStorage**: In-memory storage for testing

## Breaking Changes from Previous Versions

- **Configuration System**: TypeScript configuration classes replaced with YAML files and Zod schemas
- **Component Data Loading**: Static imports replaced with validated YAML data loading
- **API Interfaces**: Component interfaces now use validated data types from schemas

## Schema Validation System

The template uses Zod schemas for automatic validation of YAML configuration data.

### Component Schemas

All components export standardized schemas for configuration validation:

```typescript
// Component schema pattern
export const ComponentSchema = z.object({
  // Schema definition
});

export const componentSchema = ComponentSchema;
export const schemaKey = 'componentName';
```

### Portfolio Component Schema

**Configuration File:** `config/portfolioData.yml`

```typescript
export const PortfolioDataSchema = z.object({
  header: z.object({
    title: z.string(),
    subtitle: z.string()
  }),
  technologies: z.array(
    z.object({
      name: z.string(),
      category: z.string()
    })
  ),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      link: z.string(),
      icon: z.string()
    })
  ),
  stats: z.array(
    z.object({
      number: z.string(),
      label: z.string()
    })
  ),
  seo: z.object({
    title: z.string(),
    description: z.string()
  })
});
```

### Projects Component Schema

**Configuration File:** `config/projects.yml`

```typescript
export const ProjectSchema = z.object({
  title: z.string(),
  summary: z.string(),
  lastModified: z.string().optional(),
  link: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const ProjectConfigSchema = z.object({
  categories: z.array(
    z.object({
      category: z.string(),
      subCategories: z.array(
        z.object({
          name: z.string(),
          projects: z.array(ProjectSchema)
        })
      )
    })
  )
});
```

### CV Component Schema

**Configuration File:** `config/cvData.yml`

```typescript
export const CVDataSchema = z.object({
  header: z.object({
    title: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string()
        })
      )
      .optional()
  }),
  about: z.object({
    title: z.string(),
    body: z.string()
  }),
  roles: z.array(
    z.object({
      icon: z.string().optional(),
      company: z.string(),
      title: z.string(),
      location: z.string().optional(),
      period: z.string(),
      website: z.string().optional(),
      summary: z.string().optional(),
      achievements: z.array(z.string()).optional(),
      tech: z.string().optional()
    })
  )
});
```

### NavBar Links Component Schema

**Configuration File:** `config/navBarLinks.yml`

The NavBar Links component provides configurable navigation links with dropdown support and automatic positioning.

```typescript
export const NavBarLinksSchema = z.object({
  dropdown: z.boolean().optional(),
  dropdownLabel: z.string().optional(),
  className: z.string().optional(),
  showIcons: z.boolean().optional(),
  links: z
    .array(
      z.object({
        href: z.string(),
        label: z.string(),
        position: z.enum(['left', 'right']).optional(), // Defaults to 'left'
        target: z.enum(['_blank', '_self']).optional(),
        title: z.string().optional(),
        className: z.string().optional(),
        icon: z.union([z.string(), z.any()]).optional() // FontAwesome icon
      })
    )
    .optional()
});
```

#### Interface Definition

```typescript
export interface CustomNavBarLink {
  href: string;
  label: string;
  position?: 'left' | 'right'; // Defaults to 'left' when not provided
  target?: '_blank' | '_self';
  title?: string;
  className?: string;
  icon?: IconDefinition | string;
}

// Utility function to ensure position defaults to 'left'
export const withDefaultPosition = (
  link: CustomNavBarLink
): CustomNavBarLink => ({
  ...link,
  position: link.position || 'left'
});
```

**Key Features:**

- **Position Default**: All links default to `position: 'left'` when not specified
- **External Link Detection**: Automatic handling of internal vs external URLs
- **Icon Support**: FontAwesome icons via string names or IconDefinition objects
- **Type Safety**: Full TypeScript interface validation

```typescript
export class BadgeConfig {
  static templateVariables: TemplateVariables;
  static badgeCategories: BadgeCategory[];
}
```

#### BadgeConfig Properties

| Property            | Type                | Description                                    |
| ------------------- | ------------------- | ---------------------------------------------- |
| `templateVariables` | `TemplateVariables` | Global template variables for URL substitution |
| `badgeCategories`   | `BadgeCategory[]`   | Array of badge categories with grouped badges  |

#### TemplateVariables Interface

```typescript
interface TemplateVariables {
  demoUrl: string; // Demo application URL
  docsUrl: string; // Documentation site URL
  user: string; // GitHub username/organization
  repository: string; // Repository name
}
```

#### BadgeCategory Interface

```typescript
interface BadgeCategory {
  key: string; // Unique category identifier
  title: string; // Display title for the category
  icon: string; // FontAwesome icon name
  badges: Badge[]; // Array of badges in this category
}
```

#### Badge Interface

```typescript
interface Badge {
  name: string; // Badge display name
  url: string; // Badge image URL (supports template variables)
  link: string; // Destination URL when badge is clicked
}
```

#### BadgeConfig Usage Example

```typescript
import { BadgeConfig } from '@site/src/config/badge-config';

// Update template variables
BadgeConfig.templateVariables.user = 'your-org';
BadgeConfig.templateVariables.repository = 'your-repo';

// Access badge categories
const buildCategory = BadgeConfig.badgeCategories.find(
  (cat) => cat.key === 'buildRelease'
);
```

### GitHubLinksConfig

Manages GitHub-related links in the navbar with FontAwesome icons and responsive design.

```typescript
export class GitHubLinksConfig {
  static enabled: boolean;
  static links: GitHubLink[];
  static dropdown?: boolean;
  static className?: string;
  static dropdownLabel?: string;
  static showIcons?: boolean;
}
```

#### Properties

| Property        | Type           | Default     | Description                   |
| --------------- | -------------- | ----------- | ----------------------------- |
| `enabled`       | `boolean`      | `true`      | Whether to show GitHub links  |
| `links`         | `GitHubLink[]` | `[]`        | Array of GitHub-related links |
| `dropdown`      | `boolean`      | `false`     | Show as dropdown menu         |
| `className`     | `string`       | `undefined` | Custom CSS class              |
| `dropdownLabel` | `string`       | `'GitHub'`  | Dropdown button label         |
| `showIcons`     | `boolean`      | `true`      | Display FontAwesome icons     |

#### GitHubLink Interface

```typescript
interface GitHubLink {
  href: string; // URL for the link
  label: string; // Display text
  position?: 'left' | 'right'; // Navbar position
  target?: '_blank' | '_self'; // Link target
  title?: string; // Tooltip text
  className?: string; // Custom CSS class
  icon?: IconDefinition; // FontAwesome icon
}
```

#### Usage Example

```typescript
import { GitHubLinksConfig } from '@site/src/config/github-links-config';
import { faGithub, faTag } from '@fortawesome/free-brands-svg-icons';

// Configure links
GitHubLinksConfig.links = [
  {
    href: 'https://github.com/your-org/your-repo',
    label: 'GitHub',
    icon: faGithub,
    title: 'View source code'
  },
  {
    href: 'https://github.com/your-org/your-repo/releases',
    label: 'Releases',
    icon: faTag,
    title: 'Download releases'
  }
];

// Enable dropdown mode
GitHubLinksConfig.dropdown = true;
GitHubLinksConfig.dropdownLabel = 'Project Links';
```

### GiscusConfig

Manages GitHub Discussions integration for comments with automatic theme adaptation.

```typescript
export class GiscusConfig {
  static repo: string;
  static repoId: string;
  static category: string;
  static categoryId: string;
  static mapping: string;
  static reactionsEnabled: boolean;
  static emitMetadata: boolean;
  static inputPosition: string;
  static theme: string;
  static lang: string;
  static loading: string;
}
```

#### GiscusConfig Properties

| Property           | Type      | Default                    | Description                    |
| ------------------ | --------- | -------------------------- | ------------------------------ |
| `repo`             | `string`  | `''`                       | GitHub repository (owner/repo) |
| `repoId`           | `string`  | `''`                       | Repository ID from Giscus      |
| `category`         | `string`  | `''`                       | Discussion category name       |
| `categoryId`       | `string`  | `''`                       | Category ID from Giscus        |
| `mapping`          | `string`  | `'pathname'`               | Page-to-discussion mapping     |
| `reactionsEnabled` | `boolean` | `true`                     | Enable reactions               |
| `emitMetadata`     | `boolean` | `false`                    | Emit metadata events           |
| `inputPosition`    | `string`  | `'top'`                    | Comment input position         |
| `theme`            | `string`  | `'preferred_color_scheme'` | Theme mode                     |
| `lang`             | `string`  | `'en'`                     | Interface language             |
| `loading`          | `string`  | `'lazy'`                   | Loading strategy               |

#### GiscusConfig Usage Example

```typescript
import { GiscusConfig } from '@site/src/config/giscus-config';

// Configure Giscus integration
GiscusConfig.repo = 'your-org/your-repo';
GiscusConfig.repoId = 'R_kgDOH1234567';
GiscusConfig.category = 'Documentation';
GiscusConfig.categoryId = 'DIC_kwDOH1234567_Bg';
```

### VersionConfig

Manages version display in the navbar with automated date-based versioning.

```typescript
export class VersionConfig {
  static enabled: boolean;
  static version?: string;
  static href?: string;
  static prefix?: string;
  static badge?: boolean;
  static className?: string;
  static title?: string;
}
```

#### VersionConfig Properties

| Property    | Type      | Default         | Description           |
| ----------- | --------- | --------------- | --------------------- |
| `enabled`   | `boolean` | `true`          | Show version display  |
| `version`   | `string`  | Auto-generated  | Custom version string |
| `href`      | `string`  | GitHub releases | Link URL              |
| `prefix`    | `string`  | `'v'`           | Version prefix        |
| `badge`     | `boolean` | `true`          | Use badge styling     |
| `className` | `string`  | `undefined`     | Custom CSS class      |
| `title`     | `string`  | Auto-generated  | Tooltip text          |

#### VersionConfig Usage Example

```typescript
import { VersionConfig } from '@site/src/config/version-config';

// Customize version display
VersionConfig.version = '2.1.0';
VersionConfig.href = 'https://github.com/your-org/your-repo/releases';
VersionConfig.prefix = 'Version ';
VersionConfig.badge = false; // Simple text display
```

## Component Interfaces

### Theme Interface

Defines theme structure for the dynamic theme system.

```typescript
interface Theme {
  name: string; // Unique theme identifier
  displayName: string; // Human-readable theme name
  cssFile: string; // Path to theme CSS file
}
```

### NavbarLink Interface

Defines auto-generated navbar links from markdown content.

```typescript
interface NavbarLink {
  label: string; // Link display text
  to: string; // Destination path
}
```

## Component Props

### GitHubProjectBadges Props

```typescript
interface GitHubProjectBadgesProps {
  user?: string; // Override default user
  repository?: string; // Override default repository
  groups?: string[]; // Filter badge categories
}
```

### GiscusComments Props

```typescript
interface GiscusCommentsProps {
  repo?: `${string}/${string}`;
  repoId?: string;
  category?: string;
  categoryId?: string;
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  term?: string;
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
  inputPosition?: 'top' | 'bottom';
  lang?: string;
  loading?: 'lazy' | 'eager';
}
```

### GitHubLinks Props

```typescript
interface GitHubLinksProps {
  links?: GitHubLink[]; // Override default links
  dropdown?: boolean; // Show as dropdown
  className?: string; // Custom CSS class
  showIcons?: boolean; // Display icons
}
```

## Build System

### PreBuild Class

Handles content preparation, theme scanning, and navbar generation.

```typescript
export class PreBuild {
  private themes: Theme[];

  public generateThemeConfig(): void;
  private copyMarkdown(): void;
  private generateNavbar(): void;
  public process(): void;
}
```

#### Methods

| Method                  | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `generateThemeConfig()` | Scans themes directory and generates theme configuration |
| `copyMarkdown()`        | Copies root markdown files to pages directory            |
| `generateNavbar()`      | Auto-generates navbar links from available content       |
| `process()`             | Executes complete pre-build process                      |

### Build Configuration

#### Package.json Scripts

| Script          | Command                                  | Description                  |
| --------------- | ---------------------------------------- | ---------------------------- |
| `prestart`      | `tsx ./scripts/pre-build.ts`             | Pre-build before development |
| `start`         | `docusaurus start`                       | Start development server     |
| `prebuild:prod` | `tsx ./scripts/pre-build.ts`             | Pre-build before production  |
| `build:prod`    | `docusaurus build --out-dir ./artifacts` | Production build             |
| `lint`          | `eslint "src/**/*.{ts,tsx}"`             | ESLint checking              |
| `format`        | `prettier --write .`                     | Format with Prettier         |
| `check-all`     | Combined format, lint, and type checks   | Quality assurance            |

## Hooks and Utilities

### useConfig Hook

Custom hook for badge configuration with template variable resolution.

```typescript
function useConfig({
  user,
  repository,
  groups
}: UseBadgeConfigProps): UseBadgeConfigResult;
```

#### Parameters

```typescript
interface UseBadgeConfigProps {
  user?: string; // Override template user
  repository?: string; // Override template repository
  groups?: string[]; // Filter badge categories
}
```

#### Return Value

```typescript
interface UseBadgeConfigResult {
  badgeSections: BadgeSection[]; // Processed badge sections
  loading: boolean; // Loading state
}

interface BadgeSection {
  key: string; // Category key
  title: string; // Display title
  icon: IconDefinition; // FontAwesome icon
  badges: ProcessedBadge[]; // Processed badges with resolved URLs
}
```

## TypeScript Configuration

### Path Aliases

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@site/*": ["./src/*"]
    }
  }
}
```

### Module Types

The template includes custom type definitions for better TypeScript integration:

```typescript
// src/types/json.d.ts
declare module '*.json' {
  const value: any;
  export default value;
}
```

## ESLint Configuration

### Flat Config Structure

```javascript
// eslint.config.js
export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module'
      }
    },
    rules: {
      // Relaxed rules for Docusaurus compatibility
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
```

## Migration Helpers

### Legacy Support

The template maintains backward compatibility while encouraging migration to new patterns:

```typescript
// Old JSON config (still works)
// badge-config.json

// New static class (recommended)
import { BadgeConfig } from '@site/src/config/badge-config';
```

### Version Detection

```typescript
// Automatic date-based versioning
const getDefaultVersion = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};
```

This API reference covers all public interfaces and configuration options available in the Docusaurus Template. For usage examples and detailed guides, refer to the component-specific documentation sections.
