---
id: configuration
title: Configuration
sidebar_position: 1
---

## YAML-Based Configuration System (v1.0)

The Docusaurus Template v1.0 uses a modern YAML-based configuration system with automatic schema validation. This replaces the previous TypeScript-based configuration with a more maintainable and user-friendly approach.

### Core Configuration Files

All configuration is stored in YAML files under the `config/` directory:

```yaml
# config/globalConfig.yml - Main site configuration
preBuild:
  projectRoot: ../
  overwriteExistingFiles: true
  copyMarkdownFromProjectRoot: false
  generateNavBarForPages: false
  defaultTheme: blue

site:
  title: Docusaurus Template
  tagline: Template for Documentation Sites
  url: http://docs-template.subzerodev.com/
  baseUrl: /
  organizationName: The-Running-Dev
  projectName: Docusaurus Template

theme:
  navbar:
    title: Template
```

### Component Configuration Files

Each component has its own YAML configuration file:

```yaml
# config/giscus.yml - Comments system
repo: the-running-dev/docusaurus-template
repoId: R_kgDOPPNj-Q
category: Docs
categoryId: DIC_kwDOPPNj-c4CtnVD
mapping: pathname
reactionsEnabled: true
theme:
  light: light
  dark: dark

# config/badges.yml - GitHub badges
groups:
  - name: Build
    badges:
      - alt: Build Status
        src: https://img.shields.io/github/actions/workflow/status/{user}/{repository}/ci.yml

# config/projects.yml - Project showcase data
- category: 'Frontend'
  subCategories:
    - name: 'Angular'
      projects:
        - title: 'Project Name'
          link: 'https://github.com/user/repo'
          summary: 'Project description'
          tags: [Angular, TypeScript]
```

### Schema Validation

All YAML configurations are automatically validated using Zod schemas:

```typescript
// Automatic validation during data loading
import { validateData } from '../schemas';

// Each component schema validates its YAML data
const portfolioData = await validateData('portfolioData', rawYamlData);
const projectsData = await validateData('projects', rawYamlData);
```

### Breaking Changes from Previous Versions

- **Removed**: `config/site-config.ts` - Replaced with `config/globalConfig.yml`
- **Removed**: Inline TypeScript configuration classes
- **Added**: Schema validation for all configuration data
- **Added**: Automatic YAML loading and type safety
