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

Professional portfolio showcase with hierarchical project categorization, interactive category cards, and advanced filtering capabilities.

**Configuration:** `config/portfolioData.yml`
**Live Component:** `/portfolio`
**Demo Page:** `/demos/portfolio`

```yaml
# config/portfolioData.yml
header:
  title: Portfolio
  subtitle: Technical Projects & Experience

projects:
  - category: Frontend
    subCategories:
      - name: React
        projects:
          - title: Docusaurus Template
            link: https://github.com/example/docusaurus-template
            summary: Professional documentation template
            tags:
              - React
              - TypeScript
              - Docusaurus
  - category: Backend
    subCategories:
      - name: .NET
        projects:
          - title: Business Intelligence
            link: https://github.com/example/bi-project
            summary: PowerBI integration web interface
            tags:
              - .NET
              - PowerBI
              - Analytics

technologies:
  - name: .NET Core
    category: Backend
  - name: TypeScript
    category: Frontend
```

**New Features (v1.0.1):**

- **Category-Based Architecture**: Hierarchical organization with categories and subcategories
- **Interactive Category Cards**: Clickable cards that filter projects dynamically
- **Project Filtering Hook**: `useProjectFiltering` for managing filter logic and navigation
- **Enhanced Data Model**: Support for nested project structures with comprehensive metadata
- **Smart Navigation**: Category cards link to filtered project views with URL state management
- **Business Intelligence Support**: Dedicated category for BI and analytics projects

**Component Architecture:**

```typescript
// New portfolio components
import Categories from './components/Categories';        // Category display grid
import CategoryCard from './components/CategoryCard';   // Individual category cards  
import ProjectsLink from './components/ProjectsLink';   // Smart filtering links
import { useProjectFiltering } from './hooks/useProjectFiltering'; // Filter logic
```

### Projects Component (Enhanced in v1.0.1)

Advanced project listing with search, category filtering, and URL-based state management. Now supports hierarchical project organization and advanced filtering capabilities.

**Configuration:** `config/projects.yml`
**Live Component:** `/projects`
**Demo Page:** `/demos/projects`

```yaml
# config/projects.yml
- category: Frontend
  subCategories:
    - name: Angular
      projects:
        - title: BarStrad
          link: https://github.com/The-Running-Dev/BarStrad-UI
          lastModified: 2025-02-09T23:05:00Z
          summary: Angular based menu application with theming, language support, orders, and Discord notifications
          tags:
            - Angular
            - TypeScript
            - Frontend
            - Bar
            - Menu
            - Discord
            - Theming
            - i18n
    - name: React
      projects:
        - title: Docusaurus Template  
          link: https://github.com/example/docusaurus-template
          lastModified: 2025-08-16T00:00:00Z
          summary: Reusable Docusaurus template with advanced features
          tags:
            - React
            - Docusaurus
            - TypeScript

- category: Business Intelligence
  subCategories:
    - name: Business Intelligence
      projects:
        - title: Business Intelligence Web Interface
          link: https://github.com/example/bi-interface
          lastModified: 2019-04-16T23:52:00Z
          summary: Web interface to expose data charted through PowerBI
          tags:
            - .NET
            - C#
            - Business Intelligence
            - Power BI
            - Data Analysis
```

**Enhanced Features (v1.0.1):**

- **Category Filtering**: Filter projects by top-level categories (Frontend, Backend, etc.)
- **Tag-Based Filtering**: Advanced tag filtering with URL parameter support
- **Hierarchical Data**: Support for categories → subcategories → projects structure
- **Enhanced Metadata**: Added `lastModified` dates and comprehensive tagging
- **Business Intelligence Category**: New dedicated category for BI and analytics projects
- **Improved Search**: Better search functionality across all project metadata

**Enhanced Data Processing (v1.0):**

- **Safety Guards**: Null/undefined data protection to prevent runtime exceptions
- **Memory Management**: Improved cleanup and error handling
- **Type Safety**: Comprehensive data validation and filtering
- **Performance**: Optimized data processing with memoization

**Technical Implementation:**

```typescript
// Safety guard for raw data processing
const isRawReady = rawData != null;

const { processedData, loading, error } = useProcessor(
  isRawReady ? rawData : { categories: [] },
  {
    selectedCategory: selectedFilter,
    selectedDateRange,
    searchTerm
  }
);
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

### Custom 404 Error Page (New in v1.0)

Interactive animated 404 page with engaging user experience.

**File Location:** `src/components/Custom404/Custom404.tsx`
**Theme Integration:** `src/theme/NotFound/Content/index.tsx`
**Live Page:** Visit any non-existent URL (e.g., `/non-existent-page`)
**Demo Page:** `/demos/404-demo`
**Documentation:** `/docs/core-systems/404-error-page`

**Key Features:**

- **Interactive Elements**: Cat facts spinner, excuse generator
- **Animations**: Rainbow CSS gradients, rotation effects
- **Emergency Navigation**: Quick links to important pages
- **Engagement**: Turns errors into delightful user experiences
- **Global Coverage**: Handles all 404s through theme system

**Technical Implementation:**

```typescript
// Reusable component
import Custom404 from '../../../components/Custom404';

// Theme-level integration
export default function ContentWrapper(): ReactNode {
  return <Custom404 />;
}
```

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
