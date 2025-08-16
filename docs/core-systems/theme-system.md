---
id: theme-system
title: Theme System
sidebar_position: 12
---

This template includes a sophisticated theme switching system with 10+ professionally designed color themes that are dynamically loaded and persisted in localStorage. **Version 1.0** includes significant improvements for path resolution and cross-route compatibility.

## 🚨 Breaking Changes in v1.0

### Path Resolution Fixed

- **Fixed**: Theme switcher now works correctly on all routes (`/`, `/docs/template`, etc.)
- **Change**: Uses Docusaurus `useBaseUrl` hook for proper path resolution
- **Migration**: No changes needed for existing themes - paths are automatically resolved

### Configuration Architecture

- **New**: Centralized configuration in `config/globalConfig.yml`
- **Change**: Theme data now stored in `src/themes.json` (auto-generated)
- **Change**: TypeScript entities moved to `src/entities/`

## Available Themes

- **Default/Elegant** - Refined green with glassmorphism effects
- **Ocean Blue** - Professional blue tones with modern contrast
- **Sunset** - Warm orange and red gradients (default theme)
- **Purple Night** - Deep purple for dark environments
- **Forest** - Natural green shades with earthy tones
- **Agent** - Dark theme optimized for development
- **Material Design Themes** - Five variants following Material Design:
  - **Material Red** - Bold red with proper contrast ratios
  - **Material Indigo** - Deep indigo for professional applications
  - **Material Teal** - Calming teal for content-focused sites
  - **Material Amber** - Warm amber for creative projects
  - **Material Pink** - Subtle pink for modern aesthetics
- **Nuke** - Minimal dark theme for distraction-free reading

## Implementation Architecture

### Component Architecture (v1.0)

```typescript
// ThemeSwitcher.tsx - New implementation
import useBaseUrl from '@docusaurus/useBaseUrl';

const ThemeSwitcher: React.FC = () => {
  // Pre-compute resolved URLs for all themes
  const themesWithResolvedUrls = themes.map((theme) => ({
    ...theme,
    resolvedCssUrl: useBaseUrl(theme.cssFile)
  }));

  // Theme application with resolved URLs
  const applyTheme = (themeName: string) => {
    const theme = themesWithResolvedUrls.find((t) => t.name === themeName);
    if (!theme) return;

    // Create link with resolved URL
    link.href = theme.resolvedCssUrl;
  };
};
```

### Path Resolution System

**Before v1.0** (Problematic):

```typescript
// ❌ Relative paths failed on sub-routes
cssFile: 'themes/blue.css'; // Failed on /docs/template
```

**v1.0** (Fixed):

```typescript
// ✅ useBaseUrl resolves paths correctly on all routes
resolvedCssUrl: useBaseUrl(theme.cssFile); // Works everywhere
```

### Data Structure

Theme configuration is now stored in `src/themes.json` (auto-generated):

```json
{
  "themes": [
    {
      "name": "sunset",
      "displayName": "Sunset",
      "cssFile": "themes/sunset.css"
    }
  ],
  "defaultTheme": "sunset"
}
```

## Configuration

### Default Theme Setting

Configure the default theme in `config/globalConfig.yml`:

```yaml
# config/globalConfig.yml
preBuild:
  defaultTheme: blue
# Theme configuration is auto-generated in data/themes.json
```

### Theme Files Location

Theme files remain in `static/themes/` for direct access:

```text
static/themes/
├── sunset.css              # Default theme
├── blue.css                # Ocean Blue theme
├── purple.css              # Purple night theme
├── forest.css              # Forest green theme
├── material-*.css          # Material Design variants
├── nuke.css                # Minimal dark theme
└── default.css             # Fallback theme
```

### How Theme Switching Works

The ThemeSwitcher component (`src/components/ThemeSwitcher/`) provides:

- **Dynamic Loading**: CSS files are injected via `<link>` tags with `data-theme-switcher` attribute
- **Path Resolution**: Uses Docusaurus `useBaseUrl` for consistent paths across all routes
- **Persistence**: Selected theme is saved in `localStorage` as `docusaurus-theme-color`
- **Default Fallback**: Uses configured default theme from `globalConfig.yml`
- **URL Access**: Theme files are accessible via resolved URLs on all routes
- **No Build Process**: Themes load instantly without requiring rebuilds

### Adding a New Theme (v1.0)

To create a custom theme, follow these updated steps:

#### 1. Create Theme CSS File

Create a new `{name}.css` file in `static/themes/` directory with theme metadata:

```css
/* static/themes/mytheme.css */
/* @theme-id: mytheme */
/* @theme-name: My Custom Theme */

:root {
  --ifm-color-primary: #your-primary-color;
  --ifm-color-primary-dark: #your-dark-variant;
  --ifm-color-primary-light: #your-light-variant;
  --ifm-color-primary-lightest: #your-lightest-variant;
  --ifm-color-primary-darker: #your-darker-variant;
  --ifm-color-primary-darkest: #your-darkest-variant;

  /* Add more custom properties as needed */
  --ifm-background-surface-color: #your-background;
  --ifm-color-emphasis-100: #your-subtle-color;
}
```

#### 2. Run Pre-Build Script

The theme will be automatically detected when you run the pre-build process:

```bash
# Run pre-build to regenerate theme configuration
npm run prestart
# or
tsx ./scripts/pre-build.ts
```

#### 3. Add Color Preview (Optional)

Add corresponding color preview styles in `src/components/ThemeSwitcher/ThemeSwitcher.css`:

```css
.theme-switcher__color-preview--mytheme {
  background: linear-gradient(
    135deg,
    #your-primary-color,
    #your-secondary-color
  );
}
```

**That's it!** Your theme will automatically appear in the theme switcher dropdown after the pre-build process detects it.

### v1.0 Architecture Overview

#### Component Structure

```text
src/components/ThemeSwitcher/
├── ThemeSwitcher.tsx        # Main component with useBaseUrl integration
├── ThemeSwitcher.css        # Styling and color previews
└── index.ts                 # Export barrel

src/config/
└── globalConfig.yml         # Theme configuration

src/entities/
├── theme.ts                 # Theme TypeScript interface
└── navbarLink.ts            # Navbar link interface

Auto-generated:
├── src/themes.json          # Theme data (auto-generated)
└── src/navbarLinks.json     # Navbar data (auto-generated)
```

#### v1.0 Technical Implementation

- **Path Resolution**: Uses Docusaurus `useBaseUrl` hook for consistent URL resolution across all routes
- **Pre-computed URLs**: Theme URLs are resolved once at component initialization for better performance
- **Dynamic CSS Injection**: Themes are loaded by creating `<link>` elements with `data-theme-switcher` attribute
- **Persistence**: Uses `localStorage.setItem('docusaurus-theme-color', theme)`
- **Cleanup**: Previous theme links are removed before injecting new ones
- **Auto-detection**: New themes are automatically detected by the pre-build script
- **Type Safety**: Full TypeScript support with proper interfaces

#### Data Flow (v1.0)

```typescript
// 1. Theme data loaded from auto-generated JSON
import themeData from './themes.json';

// 2. URLs resolved using Docusaurus hook
const themesWithResolvedUrls = themes.map((theme) => ({
  ...theme,
  resolvedCssUrl: useBaseUrl(theme.cssFile) // ← Key improvement
}));

// 3. Theme applied with resolved URL
link.href = theme.resolvedCssUrl; // ← Works on all routes
```

#### Integration with Docusaurus

The theme system integrates seamlessly with Docusaurus v3.8.1:

- Uses standard CSS custom properties (`--ifm-*` variables)
- Compatible with light/dark mode switching
- Respects Docusaurus color mode preferences
- Works with all Docusaurus UI components
- **New**: Proper baseURL handling for deployments

### Theme Development Best Practices

#### v1.0 Theme Metadata

Include metadata comments in your CSS files for auto-detection:

```css
/* @theme-id: mytheme */
/* @theme-name: My Beautiful Theme */

:root {
  /* Your theme styles here */
}
```

#### Color System

Follow Docusaurus color conventions:

```css
/* Primary colors (required) */
--ifm-color-primary: #main-brand-color;
--ifm-color-primary-dark: #darker-variant;
--ifm-color-primary-light: #lighter-variant;

/* Extended palette (recommended) */
--ifm-color-primary-lightest: #lightest-variant;
--ifm-color-primary-darker: #darker-variant;
--ifm-color-primary-darkest: #darkest-variant;

/* Semantic colors (optional) */
--ifm-color-success: #success-color;
--ifm-color-warning: #warning-color;
--ifm-color-danger: #danger-color;
--ifm-color-info: #info-color;
```

#### Accessibility Guidelines

- Maintain **WCAG AA** contrast ratios (4.5:1 for normal text)
- Test themes in both light and dark modes
- Ensure sufficient contrast for links and interactive elements
- Validate color combinations with accessibility tools

#### Naming Convention

- Use descriptive theme names: `ocean-blue` not `theme1`
- Follow kebab-case for file names: `material-indigo.css`
- Use clear display names: "Material Design Indigo" not "Mat Ind"

### Default Theme Customization

Edit `src/css/custom.css` to customize the default theme (used when no theme is selected):

```css
:root {
  --ifm-color-primary: #2d7d54; /* Primary brand color */
  --ifm-color-primary-dark: #256749; /* Darker variant */
  --ifm-color-primary-light: #359962; /* Lighter variant */

  /* Custom additions */
  --ifm-font-family-base: 'Inter', system-ui, -apple-system, sans-serif;
  --ifm-heading-font-weight: 600;
  --ifm-line-height-base: 1.6;
}
```

### CSS Theme Variants

The template provides two main CSS approaches:

#### Standard Docusaurus Styling

- **File**: `src/css/custom.css`
- **Approach**: Builds on Docusaurus default styles
- **Best for**: Most documentation sites and standard use cases
- **Features**: Maintains Docusaurus UI consistency

#### Minimal/Clean Styling

- **File**: `src/css/custom.nuke.css`
- **Approach**: Comprehensive CSS reset with minimal styling
- **Best for**: Content-focused sites requiring maximum customization
- **Features**: Clean slate for custom designs

To switch between approaches, update your `docusaurus.config.ts`:

```typescript
// Standard approach
theme: {
  customCss: './src/css/custom.css',
}

// Minimal approach
theme: {
  customCss: './src/css/custom.nuke.css',
}
```

### Theme Debugging

#### Inspecting Current Theme

```javascript
// In browser console
localStorage.getItem('docusaurus-theme-color'); // Current theme
document.querySelector('[data-theme-switcher]')?.href; // Current CSS file
```

#### Theme Development Tools

- Use browser DevTools to test color combinations
- Validate accessibility with tools like axe-DevTools
- Test responsive behavior across device sizes
- Check theme persistence across page reloads

### Browser Support

- ✅ All modern browsers supporting CSS custom properties
- ✅ localStorage for theme persistence
- ✅ Dynamic `<link>` tag injection
- ✅ Graceful fallback to default theme
