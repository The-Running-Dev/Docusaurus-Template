---
id: badge-system
title: Badges
sidebar_position: 2
---

The template includes a configurable badge system for displaying GitHub project status and metrics:

**Configuration File:** `src/config/badge-config.ts`

- **GitHub Integration** - Designed for GitHub repositories with `{user}` and `{repository}` placeholders
- **Static TypeScript Config** - All badge configuration is now in a static TS class, not JSON
- **Simplified Interface** - Only requires user and repository, all URLs configured in TS
- **Default Values** - Configure defaults in the `BadgeConfig` class
- **Category Organization** - Badges grouped by: Build & Release, Distribution, Documentation, Quality, Community, Metrics
- **Runtime Loading** - Configuration loaded via static class and hook

### Usage in Components

```tsx
import GitHubProjectBadges from '../components/ProjectBadges';

// Show all badge groups (default)
<GitHubProjectBadges
  user="your-github-username"
  repository="your-repo-name"
/>

// Show only specific badge groups
<GitHubProjectBadges
  user="your-github-username"
  repository="your-repo-name"
  groups={["buildRelease", "quality"]}  // Optional, show only these groups
/>
```

### Available Badge Groups

- `buildRelease` - Build & Release (CI, Tests, Coverage)
- `distribution` - Distribution & Deployment (Version, Docker)
- `documentation` - Documentation & Demo (Docs, Demo, Uptime)
- `quality` - Quality & Security (License, Language)
- `community` - Community & Activity (Stars, Issues)
- `metrics` - Development Metrics (Last Commit, Code Size)

### Customization

Edit `src/config/badge-config.ts` to change badge categories, template variables, or add new badges. Use `{user}`, `{repository}`, and other template variables in badge URLs and links. No JSON config needed.
