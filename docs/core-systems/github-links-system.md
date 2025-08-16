---
id: github-links-system
title: GitHub Links
sidebar_position: 7
---

A flexible and professional component for displaying GitHub-related links in the Docusaurus navbar. Similar to the VersionDisplay component, it provides a centralized configuration system for managing project links with FontAwesome icons and responsive design.

## Features

- ✅ **Multiple Link Support** - Display repository, releases, container registry, and more
- ✅ **Flexible Layout** - Choose between inline links or dropdown menu
- ✅ **FontAwesome Icons** - Professional icons with React components
- ✅ **Theme Integration** - Automatically adapts to Docusaurus light/dark themes
- ✅ **Responsive Design** - Mobile-friendly with icon-only mode option
- ✅ **TypeScript Support** - Full type safety with configurable interfaces
- ✅ **Professional Styling** - Badge-style variants and hover effects
- ✅ **External Link Indicators** - SVG arrows show external destinations

## Quick Start

The GitHub Links component comes **pre-configured** with Docker BuildAgent project links and is ready to use.

### 1. Add to Navbar

In your `docusaurus.config.ts`:

```typescript
navbar: {
  items: [
    {
      type: 'custom-gitHubLinks',
      position: 'right',
    },
  ],
},
```

### 2. Customize (Optional)

The component is already enabled with professional defaults. To customize:

```typescript
// In src/config/github-links-config.ts or anywhere in your app
import { GitHubLinksConfig } from './src/config/github-links-config';

// Update the links to your repository
GitHubLinksConfig.links = [
  {
    href: 'https://github.com/your-org/your-repo',
    label: 'GitHub',
    position: 'right',
    title: 'View source code',
    icon: faGithub
  }
  // Add more links...
];
```

**That's it!** The component will show as professional links in your navbar.

## Default Configuration

The component comes pre-configured with Docker BuildAgent project links:

| Link                   | URL                                                    | Icon        | Purpose                |
| ---------------------- | ------------------------------------------------------ | ----------- | ---------------------- |
| **GitHub**             | `https://github.com/The-Running-Dev/Docker-BuildAgent` | GitHub (🐙) | Source code repository |
| **Releases**           | `../Docker-BuildAgent/releases`                        | Tag (🏷️)    | Download releases      |
| **Container Registry** | `https://ghcr.io/the-running-dev/build-agent`          | Docker (🐳) | Container images       |

## Configuration Options

### Global Settings

| Option          | Type      | Default     | Description                             |
| --------------- | --------- | ----------- | --------------------------------------- |
| `enabled`       | `boolean` | `true`      | Whether to show the GitHub links        |
| `dropdown`      | `boolean` | `false`     | Show as dropdown menu instead of inline |
| `showIcons`     | `boolean` | `true`      | Display FontAwesome icons               |
| `className`     | `string`  | `undefined` | Custom CSS class for container          |
| `dropdownLabel` | `string`  | `'GitHub'`  | Label for dropdown button               |

### Link Interface

Each link supports the following properties:

```typescript
interface GitHubLink {
  href: string; // Required: URL for the link
  label: string; // Required: Display text
  position?: 'left' | 'right'; // Navbar position (default: 'right')
  target?: '_blank' | '_self'; // Link target (default: '_blank')
  title?: string; // Tooltip text on hover
  className?: string; // Custom CSS class for this link
  icon?: IconDefinition; // FontAwesome icon object
}
```

## Usage Examples

### Container Project (Default)

```typescript
import { faGithub, faDocker } from '@fortawesome/free-brands-svg-icons';
import { faTag } from '@fortawesome/free-solid-svg-icons';

GitHubLinksConfig.links = [
  {
    href: 'https://github.com/The-Running-Dev/Docker-BuildAgent',
    label: 'GitHub',
    icon: faGithub,
    title: 'View source code on GitHub'
  },
  {
    href: 'https://github.com/The-Running-Dev/Docker-BuildAgent/releases',
    label: 'Releases',
    icon: faTag,
    title: 'View releases and changelog'
  },
  {
    href: 'https://ghcr.io/the-running-dev/build-agent',
    label: 'Container Registry',
    icon: faDocker,
    title: 'View container packages'
  }
];
```

### Dropdown Menu

```typescript
import { faBug, faComments } from '@fortawesome/free-solid-svg-icons';

GitHubLinksConfig.dropdown = true;
GitHubLinksConfig.dropdownLabel = 'Project Links';
GitHubLinksConfig.links = [
  { href: 'https://github.com/org/repo', label: 'Source', icon: faGithub },
  { href: 'https://github.com/org/repo/issues', label: 'Issues', icon: faBug },
  {
    href: 'https://github.com/org/repo/discussions',
    label: 'Discussions',
    icon: faComments
  }
];
```

### Open Source Project

```typescript
import { faHeart } from '@fortawesome/free-solid-svg-icons';

GitHubLinksConfig.links = [
  {
    href: 'https://github.com/your-org/your-repo',
    label: 'GitHub',
    icon: faGithub,
    title: 'Star us on GitHub!'
  },
  {
    href: 'https://github.com/your-org/your-repo/blob/main/CONTRIBUTING.md',
    label: 'Contribute',
    icon: faHeart,
    title: 'How to contribute'
  }
];
```

### Minimal Links (No Icons)

```typescript
GitHubLinksConfig.showIcons = false;
GitHubLinksConfig.links = [
  {
    href: 'https://github.com/your-org/your-repo',
    label: 'GitHub',
    className: 'github-links__link--badge'
  },
  {
    href: 'https://github.com/your-org/your-repo/releases',
    label: 'Releases',
    className: 'github-links__link--badge'
  }
];
```

## Advanced Configuration

### Extended Link Collection

```typescript
import { faNpm, faDocker } from '@fortawesome/free-brands-svg-icons';
import { faBook, faTag } from '@fortawesome/free-solid-svg-icons';

GitHubLinksConfig.links = [
  { href: 'https://github.com/org/repo', label: 'GitHub', icon: faGithub },
  {
    href: 'https://github.com/org/repo/releases',
    label: 'Releases',
    icon: faTag
  },
  {
    href: 'https://hub.docker.com/r/org/repo',
    label: 'Docker Hub',
    icon: faDocker
  },
  { href: 'https://www.npmjs.com/package/pkg', label: 'npm', icon: faNpm },
  { href: 'https://github.com/org/repo/wiki', label: 'Wiki', icon: faBook }
];
```

### Organization Links

```typescript
import { faUsers, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

GitHubLinksConfig.className = 'custom-github-links';
GitHubLinksConfig.links = [
  {
    href: 'https://github.com/YourOrg',
    label: 'Organization',
    icon: faUsers,
    title: 'View organization profile'
  },
  {
    href: 'https://github.com/YourOrg/main-repo',
    label: 'Main Repository',
    icon: faGithub,
    title: 'Main project repository'
  },
  {
    href: 'https://github.com/orgs/YourOrg/projects',
    label: 'Projects',
    icon: faProjectDiagram,
    title: 'Organization projects'
  }
];
```

## Styling and Theming

### CSS Custom Properties

The component uses Docusaurus CSS variables for theme consistency:

```css
.github-links__link {
  color: var(--ifm-color-emphasis-700);
  background: var(--ifm-color-emphasis-100);
}

.github-links__link:hover {
  color: var(--ifm-color-primary);
  background: var(--ifm-color-primary-lightest);
  transform: translateY(-1px);
}
```

### Custom Styling

```css
/* Custom styling example */
.custom-github-links .github-links__link {
  border-radius: 12px;
  font-weight: 600;
}

.github-links__link--badge {
  background: var(--ifm-color-emphasis-100);
  border: 1px solid var(--ifm-color-emphasis-200);
}
```

### Mobile Responsive

The component includes mobile-friendly styles:

```css
@media (max-width: 768px) {
  .github-links--mobile-icons-only
    .github-links__link
    span:not(.github-links__icon) {
    display: none; /* Show only icons on mobile */
  }
}
```

## Integration Details

### Navbar Integration

The component is integrated using Docusaurus's custom navbar item system:

```typescript
// Already registered in src/theme/NavbarItem/ComponentTypes.tsx
'custom-gitHubLinks': GitHubLinksNavbarItem
```

### FontAwesome Icons

Icons are provided as React components for better performance:

```typescript
import { FontAwesome } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

// In component
<FontAwesome icon={faGithub} className="github-links__icon" />
```

### External Link Indicators

Each link includes an external link SVG icon:

```tsx
<svg
  width="13.5"
  height="13.5"
  aria-hidden="true"
  className="iconExternalLink_qCNR"
>
  <use href="#theme-svg-external-link"></use>
</svg>
```

## Architecture

The component follows the same pattern as other template components:

```text
src/components/GitHubLinks/
├── GitHubLinks.tsx          # Main React component
├── GitHubLinks.css          # Component styling
└── index.ts                 # Export barrel

src/config/
└── github-links-config.ts   # Centralized configuration

src/theme/NavbarItem/
├── GitHubLinksNavbarItem.tsx # Navbar integration
└── ComponentTypes.tsx        # Registration

src/examples/
└── GitHubLinks-Examples.tsx  # Usage examples
```

### Design Principles

- **Configuration-First**: All settings managed via config class
- **Theme Integration**: Automatic light/dark theme support
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Performance**: Minimal re-renders and efficient DOM updates
- **Extensibility**: Easy to add new link types and styling

## Examples Reference

See `src/examples/GitHubLinks-Examples.tsx` for comprehensive configuration examples including:

- **Default configuration**: Docker BuildAgent setup
- **Dropdown menus**: Grouped project links
- **Extended collections**: Multiple service integrations
- **Custom styling**: Badge variants and themes
- **Organization profiles**: Multi-repo setups
- **Container projects**: Docker Hub integration

## Browser Support

- ✅ All modern browsers
- ✅ Responsive design for mobile devices
- ✅ Graceful fallback for missing FontAwesome icons
- ✅ CSS custom properties support
- ✅ External link accessibility

## Dependencies

- **React**: Component framework
- **@fortawesome/react-fontawesome**: Icon components
- **@fortawesome/free-brands-svg-icons**: Brand icons (GitHub, Docker, npm)
- **@fortawesome/free-solid-svg-icons**: UI icons (tags, bugs, hearts)
- **Docusaurus**: Theme integration and navbar system
- **TypeScript**: Type safety and development experience

## Troubleshooting

### Icons Not Showing

Make sure you have the required FontAwesome packages installed:

```bash
pnpm add @fortawesome/free-brands-svg-icons @fortawesome/free-solid-svg-icons
```

### Links Not Appearing

Check that the component is registered in navbar configuration:

```typescript
// In docusaurus.config.ts
{
  type: 'custom-gitHubLinks',
  position: 'right',
}
```

### Styling Issues

Ensure CSS custom properties are available:

```css
/* Component uses these Docusaurus variables */
var(--ifm-color-primary)
var(--ifm-color-emphasis-700)
var(--ifm-color-emphasis-100)
```
