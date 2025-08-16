---
id: github-config
title: GitHub Config
sidebar_position: 6
---

## Overview

The GitHub config system provides a **centralized, type-safe configuration** for all GitHub project metadata and URLs. All components (badges, links, comments, automation, etc.) reference this config, ensuring consistency and maintainability.

## Configuration Structure

The config includes:

- `repo`, `organization`, `project`
- `urls`: repository, issues, discussions, docs, pages, packages, api, contributors, releases, pulls, actions, readme, avatar
- `metadata`: defaultBranch, license, topics, description
- Optional: `features`, `integrations`

Example (TypeScript):

```typescript
export const githubProject = {
  repo: 'The-Running-Dev/Portfolio',
  organization: 'The-Running-Dev',
  project: 'Portfolio',
  urls: {
    repository: 'https://github.com/The-Running-Dev/Portfolio',
    issues: 'https://github.com/The-Running-Dev/Portfolio/issues',
    discussions: 'https://github.com/The-Running-Dev/Portfolio/discussions',
    docs: 'https://github.com/The-Running-Dev/Portfolio#readme',
    pages: 'https://portfolio.subzerodev.com',
    packages: 'https://ghcr.io/the-running-dev/portfolio',
    api: 'https://api.github.com/repos/The-Running-Dev/Portfolio',
    contributors: 'https://github.com/The-Running-Dev/Portfolio/contributors',
    releases: 'https://github.com/The-Running-Dev/Portfolio/releases',
    pulls: 'https://github.com/The-Running-Dev/Portfolio/pulls',
    actions: 'https://github.com/The-Running-Dev/Portfolio/actions',
    readme: 'https://github.com/The-Running-Dev/Portfolio/blob/main/README.md',
    avatar: 'https://github.com/The-Running-Dev.png'
  },
  metadata: {
    defaultBranch: 'main',
    license: 'MIT',
    topics: ['docusaurus', 'portfolio', 'typescript', 'documentation'],
    description:
      'A modern, type-safe Docusaurus portfolio and documentation template.'
  }
};
```

## API & Utilities

- `getGitHubConfig()`: Returns validated config (throws on error)
- `useGitHubConfig()`: React hook for config access
- `getGitHubUrls()`, `getProjectMetadata()`, `getRepositoryInfo()`: Utility accessors
- `getGitHubUrl(key)`, `getRepositoryUrl(path)`, `getApiUrl(endpoint)`: Dynamic URL builders

### In Badge System

```typescript
import { githubProject } from '../../config';
const badgeUrl = `${githubProject.repoUrl}/badges`;
const license = githubProject.license;
const topics = githubProject.topics;
```

### In Navbar Links

```typescript
import { githubProject } from '../../config';
const githubLink = githubProject.repoUrl;
const docsLink = githubProject.docsUrl;
const pagesLink = githubProject.pagesUrl;
```

### In Giscus Comments

```typescript
import { githubProject } from '../../config';
const repo = githubProject.repo;
const repoOwner = githubProject.organization;
const repoName = githubProject.project;
```

### In Automation Scripts

```typescript
import { githubProject } from '../../config';
const apiUrl = githubProject.apiUrl;
const defaultBranch = githubProject.defaultBranch;
```

## Benefits

- **Consistency:** All GitHub references and metadata are always up-to-date
- **Maintainability:** Update once, propagate everywhere
- **Type Safety:** Prevents typos and broken links
- **Scalability:** Easy to extend with more metadata and automation
- **Onboarding:** New contributors find project info in one place
- **Automation Ready:** Enables richer CI/CD, analytics, and UI features

## Migration Notes

- Refactor existing components and scripts to use the new generic config
- Remove hardcoded GitHub URLs and metadata from components and scripts
- Document the config structure and usage in main README
