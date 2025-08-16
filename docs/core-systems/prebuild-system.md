---
id: prebuild-system
title: Pre-Build System
sidebar_position: 9
---

The Pre-Build System v1.0 automates content preparation and configuration generation before Docusaurus starts. The enhanced `PreBuild` class (`scripts/pre-build.ts`) provides comprehensive automation.

## System Overview

### Core Functions

- **Markdown Processing**: Copies root `.md` files to `src/pages/` (README.md → index.md)
- **Navbar Generation**: Auto-generates navigation from markdown files
- **Theme Discovery**: Automatically detects and configures themes from CSS files
- **Configuration Management**: Generates JSON configurations with metadata extraction

### v1.0 Enhancements

- **Theme Auto-Detection**: Scans `static/themes/` and extracts metadata from CSS files
- **JSON Generation**: Creates `src/themes.json` and `src/navbarLinks.json`
- **Metadata Extraction**: Parses CSS comments for theme IDs and display names
- **Cross-Platform**: Improved Windows/Linux/macOS compatibility
- **Enhanced Error Handling**: Better fallbacks and error reporting

## Pre-Build Process

### Automatic Execution

```bash
# Runs automatically before these commands:
npm start           # Pre-build → development server
npm run build:prod  # Pre-build → production build

# Manual execution:
npm run prestart    # Development pre-build
npm run prebuild:prod # Production pre-build with NODE_ENV
tsx ./scripts/pre-build.ts # Direct execution
```

### Process Steps

1. **Copy Markdown Files**
   - Copies `.md` files from project root to `src/pages/`
   - Transforms `README.md` → `index.md` (homepage)
   - Respects `OverwriteExistingFiles` configuration

2. **Generate Navbar Configuration**
   - Scans `src/pages/` for markdown files
   - Creates navigation entries (excludes index.md)
   - Outputs to `src/navbarLinks.json`

3. **Theme Discovery and Configuration**
   - Scans `static/themes/` directory for CSS files
   - Extracts metadata from CSS comment headers
   - Generates `src/themes.json` with theme data and default

## Theme Auto-Detection

### CSS Metadata Format

```css
/* static/themes/mytheme.css */
/* @theme-id: professional-blue */
/* @theme-name: Professional Blue Theme */

:root {
  --ifm-color-primary: #1976d2;
  /* Your theme styles */
}
```

### Metadata Processing

The pre-build script extracts:

- **Theme ID**: From `@theme-id` comment (fallback: filename)
- **Display Name**: From `@theme-name` comment (fallback: capitalized filename)
- **CSS Path**: Relative path for Docusaurus compatibility

### Generated Output

```json
// src/themes.json (auto-generated)
{
  "themes": [
    {
      "name": "professional-blue",
      "displayName": "Professional Blue Theme",
      "cssFile": "themes/mytheme.css"
    }
  ],
  "defaultTheme": "sunset"
}
```

## Configuration System

### YAML-Based Configuration

The system reads from `config/globalConfig.yml`:

```yaml
# config/globalConfig.yml
preBuild:
  projectRoot: ../
  overwriteExistingFiles: true
  copyMarkdownFromProjectRoot: false
  generateNavBarForPages: false
  defaultTheme: default

site:
  title: Docusaurus Template
  tagline: Template Documentation
  url: http://docs-template.subzerodev.com/
  baseUrl: /
  organizationName: The-Running-Dev
  projectName: Docusaurus Template
```

### Generated Configurations

The pre-build system creates two JSON files:

#### `src/themes.json`

```json
{
  "themes": [
    {
      "id": "sunset",
      "name": "Sunset",
      "css": "/themes/sunset.css"
    }
  ],
  "defaultTheme": "sunset"
}
```

#### `src/navbarLinks.json`

````json
{
  "links": [
    {
      "to": "status",
      "label": "Status",
      "position": "left"
    }
  ]
}
``` Architecture

### Centralized Settings

```typescript
// config/site-config.ts
export const PreBuildConfig = {
  OverwriteExistingFiles: true,
  DefaultTheme: 'default'
};
````

### Class-Based Implementation

```typescript
// scripts/pre-build.ts
export class PreBuild {
  // Theme discovery and configuration
  public generateThemeConfig(): void;

  // Markdown file processing
  private copyMarkdown(): void;

  // Navbar generation
  private generateNavbar(): void;

  // YAML to JSON conversion
  private processYamlToJson(): void;

  // Main orchestration
  public process(): void;
}
```

## Error Handling

### Graceful Fallbacks

- **Missing Theme Directory**: Warns and continues
- **Invalid CSS Metadata**: Uses filename-based fallbacks
- **File System Errors**: Detailed error reporting with context
- **Missing Configuration**: Provides sensible defaults

### Debugging Output

```bash
✅ Markdown Files Copied: 2 File(s)
✅ Navbar Config Created with 2 Entry(s)
✅ Theme Config Created with 12 Theme(s)
🚀 Pre Build Process Completed
```

## Advanced Usage

### Custom Theme Detection

Add new themes by simply placing CSS files in `static/themes/`:

```bash
static/themes/
├── my-custom-theme.css    # ← Automatically detected
└── company-branding.css   # ← Also detected

# Run pre-build
npm run prestart

# Themes now available in switcher
```

### Build Environment Handling

```bash
# Development pre-build
NODE_ENV=development tsx ./scripts/pre-build.ts

# Production pre-build (with optimizations)
NODE_ENV=production tsx ./scripts/pre-build.ts
```

### Manual Configuration Override

```typescript
// Override default configuration
const customConfig = {
  ...PreBuildConfig,
  DefaultTheme: 'my-custom-theme'
};
```

## Integration Points

### Docusaurus Integration

- **Theme Loading**: Generated JSON consumed by `src/themes.ts`
- **Navbar**: Generated links integrated into `docusaurus.config.ts`
- **Type Safety**: TypeScript interfaces ensure configuration validity

### Development Workflow

- **Hot Reload**: Changes to CSS files require pre-build re-run
- **Theme Development**: Add CSS → run pre-build → theme available
- **Content Updates**: Markdown changes trigger automatic re-processing

## Migration from v1.x

### Key Changes

- **Configuration**: From hardcoded arrays to auto-generated JSON
- **Theme Detection**: From manual registration to automatic discovery
- **Metadata**: From filename-only to rich CSS metadata support
- **Path Handling**: From absolute paths to relative paths for better portability

### Upgrade Steps

1. **Move configurations** to `config/globalConfig.yml`
2. **Add metadata** to existing CSS theme files
3. **Run pre-build** to generate new configuration files
4. **Verify** all themes appear in the switcher

This enhanced pre-build system significantly improves maintainability and developer experience while providing automatic discovery of themes and content.
