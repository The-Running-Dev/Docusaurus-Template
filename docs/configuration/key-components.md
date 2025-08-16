---
id: key-components
title: Components
sidebar_position: 5
---

## Data-Driven Components (v1.0)

All components now use YAML configuration with automatic schema validation for type safety and maintainability.

### NavBar Links Component

Configurable navigation links with dropdown support and automatic positioning.

**Configuration:** `config/navBarLinks.yml`
**Navbar Integration:** Automatically available as navbar item
**Demo Page:** `/demos/github-links`

```yaml
# config/navBarLinks.yml
dropdown: true
dropdownLabel: 'Demos'
showIcons: true
links:
  - label: 'Badges'
    href: '/demos/badges'
    position: 'left' # Defaults to 'left' when not specified
  - label: 'External Link'
    href: 'https://example.com'
    position: 'right'
    target: '_blank'
```

**Key Features:**

- **Default Position**: Links default to `position: 'left'` when not specified
- **External Link Detection**: Automatic handling of internal vs external URLs
- **Icon Support**: FontAwesome icon integration
- **Dropdown Mode**: Collapsible menu for space efficiency

### Portfolio Component

Professional portfolio showcase with project categorization and filtering.

**Configuration:** `config/portfolioData.yml`
**Live Component:** `/portfolio`
**Demo Page:** `/demos/portfolio`

```yaml
# config/portfolioData.yml
header:
  title: Portfolio
  subtitle: Technical Projects & Experience

projects:
  - title: Backend Projects
    description: C# .NET, Node.js, TypeScript applications
    link: /projects?filter=backend
    icon: '🔧'

technologies:
  - name: .NET Core
    category: Backend
  - name: TypeScript
    category: Frontend
```

### Projects Component

Advanced project listing with search, filtering, and URL-based state management.

**Configuration:** `config/projects.yml`
**Live Component:** `/projects`
**Demo Page:** `/demos/projects`

```yaml
# config/projects.yml
- category: 'Frontend'
  subCategories:
    - name: 'Angular'
      projects:
        - title: 'BarStrad'
          link: 'https://github.com/The-Running-Dev/BarStrad-UI'
          summary: 'Angular based menu application with theming'
          tags:
            - Angular
            - TypeScript
            - Restaurant
```

### CV Component

Professional CV/resume display with timeline and experience sections.

**Configuration:** `config/cvData.yml`
**Live Component:** `/cv`
**Demo Page:** `/demos/cv`

```yaml
# config/cvData.yml
header:
  title: 'Senior Developer'
  email: 'contact@example.com'

roles:
  - company: 'TechCorp'
    title: 'Lead Developer'
    period: '2022 – 2023'
    description: 'Technical leadership and development'
```

### GitHub Badge System

Dynamic project badges with template variable support.

**Configuration:** `config/badges.yml`
**Demo Page:** `/demos/badges`

```yaml
# config/badges.yml
groups:
  - name: Build
    badges:
      - alt: Build Status
        src: https://img.shields.io/github/actions/workflow/status/{user}/{repository}/ci.yml
```

### Breaking Changes

- **Removed**: Static TypeScript configuration classes
- **Added**: YAML-based configuration with schema validation
- **Added**: Live component pages (`/portfolio`, `/projects`, `/cv`)
- **Updated**: Demo pages now reference live components

### Related Resources Component

Reusable component for contextual navigation and related links.

**Usage:** Import and use in any page or component
**Demo Page:** `/demos/related-resources`
**Documentation:** `/docs/core-systems/related-resources-component`

```tsx
import RelatedResources from '@site/src/components/RelatedResources';

<RelatedResources
  title="🔗 Related Resources"
  description="Learn more about component integration:"
  links={[
    {
      href: '/docs/configuration/',
      label: '📖 Configuration Guide',
      type: 'primary'
    },
    {
      href: '/demos',
      label: '🎮 All Demos',
      type: 'secondary'
    }
  ]}
/>;
```

**Key Features:**

- **Button Types**: Primary, secondary, and outline styles
- **External Link Safety**: Automatic `rel="noopener noreferrer"` for external links
- **Responsive Design**: Works on all screen sizes
- **TypeScript Support**: Full type safety with interfaces

### Custom 404 Error Page

Interactive animated 404 page with engaging user experience.

**File Location:** `src/theme/NotFound/index.tsx`
**Live Page:** Visit any non-existent URL (e.g., `/404`)
**Demo Page:** `/demos/404-demo`
**Documentation:** `/docs/core-systems/404-error-page`

**Key Features:**

- **Interactive Elements**: Cat facts spinner, excuse generator
- **Animations**: Rainbow CSS gradients, rotation effects
- **Emergency Navigation**: Quick links to important pages
- **Engagement**: Turns errors into delightful user experiences

### Text Size Switcher

Accessibility component for adjusting text size across the site.

**Navbar Integration:** Available as navbar item
**Demo Page:** `/demos/text-size-switcher`

```yaml
# Available sizes
sizes:
  - small: 14px
  - medium: 16px (default)
  - large: 18px
  - extra-large: 20px
```

### Reader Mode

Clean reading experience toggle for improved content focus.

**Navbar Integration:** Available as navbar item  
**Demo Page:** `/demos/reader-mode`

**Features:**

- **Distraction Removal**: Hides sidebars and navigation
- **Typography Optimization**: Enhanced line spacing and contrast
- **Persistence**: Setting saved across page loads
