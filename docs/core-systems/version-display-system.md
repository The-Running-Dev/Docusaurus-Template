---
id: version-display-system
title: Version Display
sidebar_position: 12
---

A configurable version display component for Docusaurus that shows version information in the navbar with professional styling and consolidated configuration.

## Features

- ✅ **Consolidated Configuration** - Single config file with sensible defaults
- ✅ **Multiple Display Styles** - Simple text or badge styling
- ✅ **Optional Linking** - Link to changelog, releases, or version info
- ✅ **Automatic Version Detection** - Uses date-based versioning by default
- ✅ **Professional Styling** - Matches Docusaurus theme and supports dark mode
- ✅ **Mobile Responsive** - Adapts to different screen sizes
- ✅ **Show Nothing if Disabled** - Clean conditional rendering
- ✅ **TypeScript Support** - Full type safety and IntelliSense

## Quick Start

The Version Display component comes **pre-configured and ready to use** with sensible defaults.

### 1. Add to Navbar

In your `docusaurus.config.ts`:

```typescript
navbar: {
  items: [
    {
      type: 'custom-versionDisplay',
      position: 'right',
    },
  ],
},
```

### 2. Customize (Optional)

The component is already enabled with professional defaults. To customize:

```typescript
// In src/config/version-config.ts or anywhere in your app
import { VersionConfig } from './src/config/version-config';

// Update the release URL to your repository
VersionConfig.href = 'https://github.com/your-org/your-repo/releases';
// Other options are already set with good defaults
```

**That's it!** The component will show as a professional badge in your navbar.

## Default Configuration

The component comes pre-configured with these production-ready defaults:

| Setting         | Default Value           | Result                        |
| --------------- | ----------------------- | ----------------------------- |
| **Enabled**     | `true`                  | Component is visible          |
| **Prefix**      | `'v'`                   | Shows as "v2025.08.05"        |
| **Badge Style** | `true`                  | Professional badge appearance |
| **Link**        | GitHub releases URL     | Clickable badge               |
| **Tooltip**     | "View release notes..." | Helpful hover text            |
| **Version**     | Auto-generated          | Date-based (YYYY.MM.DD)       |

## Configuration Options

| Option      | Type      | Default         | Description                         |
| ----------- | --------- | --------------- | ----------------------------------- |
| `enabled`   | `boolean` | `true`          | Whether to show the version display |
| `version`   | `string`  | Auto-generated  | Custom version string               |
| `href`      | `string`  | GitHub releases | URL when clicked                    |
| `prefix`    | `string`  | `'v'`           | Text before version                 |
| `badge`     | `boolean` | `true`          | Use badge styling                   |
| `className` | `string`  | `undefined`     | Custom CSS class                    |
| `title`     | `string`  | Default tooltip | Hover text                          |

## Customization Examples

### Simple Text Display

```typescript
VersionConfig.badge = false; // Remove badge styling
VersionConfig.href = undefined; // Remove link
// Result: Simple text "v2025.08.05"
```

### Custom Version

```typescript
VersionConfig.version = '2.1.0-beta';
VersionConfig.prefix = 'Version ';
VersionConfig.className = 'custom-beta-version';
VersionConfig.title = 'Beta version - use with caution';
// Result: Badge "Version 2.1.0-beta"
```

### Minimal Display

```typescript
VersionConfig.prefix = ''; // No prefix
VersionConfig.badge = false; // Simple text
VersionConfig.href = undefined; // No link
// Result: Simple text "2025.08.05"
```

### Disable Version Display

```typescript
VersionConfig.enabled = false;
// Result: Nothing rendered
```

### Library/API Version

```typescript
VersionConfig.prefix = 'API v';
VersionConfig.href = 'https://npmjs.com/package/your-package';
VersionConfig.title = 'View package on npm';
// Result: Badge "API v2025.08.05" linking to npm
```

## Architecture

### Consolidated Configuration

The Version Display system uses a **single configuration file** approach:

- **Single Source of Truth**: All configuration in `version-config.ts`
- **No Setup Files**: No need for separate setup/initialization files
- **Sensible Defaults**: Works immediately without configuration
- **Easy Customization**: Override only what you need to change

### Component Structure

```text
src/
├── components/VersionDisplay/
│   ├── index.ts                    # Export barrel
│   ├── VersionDisplay.tsx          # Main component
│   └── VersionDisplay.css          # Professional styling
├── config/
│   └── version-config.ts           # Consolidated configuration
├── theme/NavbarItem/
│   ├── ComponentTypes.tsx          # Registers custom type
│   └── VersionDisplayNavbarItem.tsx # Navbar wrapper
└── examples/
    └── VersionDisplay-Examples.tsx # Usage examples
```

## Professional Styling

The component includes comprehensive styling that:

### Theme Integration

- **Matches Docusaurus colors** using CSS custom properties
- **Light/dark mode support** with automatic theme switching
- **Consistent with navbar** styling and spacing

### Visual Polish

- **Professional shadows** for depth and elevation
- **Smooth hover animations** with transform effects
- **Badge styling** with borders and background effects
- **Mobile responsive** design for all screen sizes

### Custom Styling

Add your own styles:

```typescript
VersionConfig.className = 'my-custom-version';
```

```css
.my-custom-version {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.my-custom-version:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}
```

## Version Generation

### Automatic Date-Based Versioning

By default, the component generates versions in `YYYY.MM.DD` format:

- `2025.08.05` for August 5th, 2025
- `2025.12.31` for December 31st, 2025

### Custom Version Override

```typescript
VersionConfig.version = '1.2.3'; // SemVer
// or
VersionConfig.version = '1.0.0-beta.1'; // Pre-release
// or
VersionConfig.version = 'v1.0-stable'; // Custom format
```

## Integration Patterns

### Development vs Production

```typescript
// Development
VersionConfig.version = '1.2.0-dev';
VersionConfig.className = 'dev-version';
VersionConfig.title = 'Development build';
VersionConfig.href = undefined; // No link in dev

// Production
VersionConfig.href = 'https://github.com/your-org/your-repo/releases';
VersionConfig.title = 'View changelog and release notes';
```

### Environment-Based Configuration

```typescript
const isProduction = process.env.NODE_ENV === 'production';

VersionConfig.enabled = isProduction; // Only show in production
VersionConfig.href = isProduction
  ? 'https://github.com/your-org/your-repo/releases'
  : undefined;
```

## TypeScript Support

Full TypeScript interfaces for type safety:

```typescript
interface VersionConfig {
  enabled: boolean;
  version?: string;
  href?: string;
  prefix?: string;
  badge?: boolean;
  className?: string;
  title?: string;
}

// Simple static properties for direct access
VersionConfig.enabled: boolean
VersionConfig.version?: string
VersionConfig.href?: string
VersionConfig.prefix?: string
VersionConfig.badge?: boolean
VersionConfig.className?: string
VersionConfig.title?: string
```

## Best Practices

### 1. Update the Release URL

```typescript
VersionConfig.href = 'https://github.com/YOUR-ORG/YOUR-REPO/releases';
```

### 2. Customize for Your Brand

```typescript
VersionConfig.prefix = 'MyApp v';
VersionConfig.className = 'brand-version';
VersionConfig.title = "View what's new in MyApp";
```

### 3. Consider Mobile Users

The component is mobile-responsive by default, but test on various screen sizes.

### 4. Use Semantic Versioning

```typescript
VersionConfig.version = '2.1.0'; // Clear semantic versioning
VersionConfig.prefix = 'v'; // Standard prefix
```

## Troubleshooting

### Component Not Showing

1. Check that it's added to navbar in `docusaurus.config.ts`
2. Verify `enabled: true` in configuration
3. Check browser console for errors

### Styling Issues

1. Verify CSS is loading properly
2. Check for conflicting styles
3. Use browser dev tools to inspect classes

### Link Not Working

1. Verify `href` is set correctly
2. Check URL format and accessibility
3. Test link in browser directly

## Migration from Old Version

If upgrading from a version with separate setup files:

1. Remove any `version-display-setup.ts` imports
2. Configuration is now built into `version-config.ts`
3. Update any custom configuration calls
4. No other changes needed - component API remains the same
