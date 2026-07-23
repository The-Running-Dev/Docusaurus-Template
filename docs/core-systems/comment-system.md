---
id: comment-system
title: Giscus Comment
sidebar_position: 3
---

Integrated comment system powered by GitHub Discussions for community engagement.

**Component Location:** `src/components/GiscusComments/`  
**Configuration File:** `src/config/giscus-config.ts`

```typescript
// Example configuration structure (edit src/config/giscus-config.ts)
export class GiscusConfig {
  static repo = 'username/repository';
  static repoId = 'your-repo-id';
  static category = 'General';
  static categoryId = 'your-category-id';
  static mapping = 'pathname';
  static reactionsEnabled = true;
  static emitMetadata = false;
  static inputPosition = 'bottom';
  static lang = 'en';
  static loading = 'lazy';
  static theme = { light: 'light', dark: 'dark' };
}
```

### Features

- **GitHub Integration** - Uses GitHub Discussions for comments
- **Theme Aware** - Automatically adapts to light/dark mode
- **Static TypeScript Config** - All Giscus configuration is in a static TS class
- **Unified Component** - Single `<GiscusComments />` component with integrated validation
- **Automatic Fallback** - Shows setup instructions when not configured
- **Flexible Interface** - Optional props with intelligent defaults
- **Type Safety** - Full TypeScript interfaces with proper error handling

### Component Architecture

The comment system uses a **consolidated architecture** with a single component that handles:

1. **Configuration Validation** - Checks if Giscus is properly set up
2. **Fallback UI** - Shows helpful instructions when configuration is missing
3. **Theme Integration** - Automatically adapts to Docusaurus themes
4. **Giscus Integration** - Direct integration with @giscus/react

### Usage Examples

#### Basic Usage (Recommended)

```tsx
// Uses defaults from GiscusConfig
<GiscusComments />
```

#### Custom Configuration

```tsx
<GiscusComments
  repo="custom/repository"
  category="Documentation"
  reactionsEnabled={false}
  inputPosition="top"
/>
```

#### Props Interface

```typescript
export interface GiscusCommentsProps {
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

### Setup Instructions

1. **Configure Giscus** - Go to [giscus.app](https://giscus.app) to get your settings
2. **Update Config** - Edit `src/config/giscus-config.ts` with your repository details
3. **Enable Discussions** - Ensure GitHub Discussions are enabled in your repository
4. **Install Giscus App** - Install the Giscus GitHub App in your repository

### Integration Points

- **Automatic Integration** - Comments appear on all doc pages by default
- **Frontmatter Control** - Use `comments: false` in frontmatter to disable on specific pages
- **Theme Swizzling** - Integrated via `src/theme/DocItem/index.tsx`

### Configuration Validation

The component automatically validates configuration and shows helpful error messages:

- Missing repository configuration
- Invalid GitHub repository format
- Missing category or category ID
- Network connectivity issues

When configuration is incomplete, users see:

- Clear error messages
- Links to configuration resources
- Step-by-step setup instructions
