---
id: related-resources
title: Related Resources
sidebar_position: 10
---

A reusable React component that displays a styled card containing related documentation links and resources. Perfect for adding contextual navigation at the end of demo pages, documentation sections, or anywhere users might need quick access to related content.

## Overview

The Related Resources component provides a clean, consistent way to present related links across your documentation site. It features:

- **Consistent Styling** using Docusaurus design tokens
- **Flexible Button Types** (primary, secondary, outline)
- **External Link Handling** with automatic `target="_blank"`
- **Responsive Design** that works on all screen sizes
- **Customizable Content** with configurable title and description

## 🎨 Features

### Visual Design

- **Card Layout**: Clean white card with subtle shadow
- **Centered Content**: Title, description, and buttons centered
- **Button Group**: Links displayed as styled Docusaurus buttons
- **Responsive Spacing**: Consistent margins and padding

### Link Types

1. **Primary Buttons**: Main call-to-action links
2. **Secondary Buttons**: Supporting or alternative links
3. **Outline Buttons**: Subtle, less prominent links

### Smart Link Handling

- **Internal Links**: Use regular href for Docusaurus routing
- **External Links**: Automatically add `target="_blank"` and `rel="noopener noreferrer"`
- **Security**: Safe external link handling with proper rel attributes

## 📁 File Structure

```text
src/components/RelatedResources/
└── index.tsx               # Component implementation and interfaces
```

## 🔧 Technical Implementation

### TypeScript Interfaces

```tsx
export interface RelatedResourceLink {
  href: string;
  label: string;
  type?: 'primary' | 'secondary' | 'outline';
  external?: boolean;
}

export interface RelatedResourcesProps {
  title?: string;
  description?: string;
  links: RelatedResourceLink[];
  className?: string;
}
```

### Component Structure

```tsx
export default function RelatedResources({
  title = '🔗 Related Resources',
  description,
  links,
  className = ''
}: RelatedResourcesProps): React.JSX.Element {
  return (
    <section className={`margin-top--lg ${className}`}>
      <div className="card shadow--lw">
        <div className="card__body text--center">
          <h3 className="margin-bottom--sm">{title}</h3>
          {description && (
            <p className="margin-bottom--lg text--secondary">{description}</p>
          )}
          <div className="button-group">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`button button--${link.type || 'primary'}`}
                {...(link.external && {
                  target: '_blank',
                  rel: 'noopener noreferrer'
                })}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

## 🚀 Usage Examples

### Basic Usage

```tsx
import RelatedResources from '@site/src/components/RelatedResources';

<RelatedResources
  links={[
    {
      href: '/docs/getting-started',
      label: '📚 Getting Started',
      type: 'primary'
    },
    {
      href: '/docs/api',
      label: '🔧 API Reference',
      type: 'secondary'
    }
  ]}
/>;
```

### Custom Title and Description

```tsx
<RelatedResources
  title="🎯 Next Steps"
  description="Continue your journey with these helpful resources:"
  links={[
    {
      href: '/docs/advanced',
      label: 'Advanced Guide',
      type: 'primary'
    },
    {
      href: '/docs/examples',
      label: 'Examples',
      type: 'outline'
    }
  ]}
/>
```

### External Links

```tsx
<RelatedResources
  title="🌐 External Resources"
  links={[
    {
      href: 'https://docusaurus.io/docs',
      label: 'Docusaurus Docs',
      type: 'primary',
      external: true
    },
    {
      href: 'https://github.com/facebook/docusaurus',
      label: 'GitHub Repository',
      type: 'secondary',
      external: true
    }
  ]}
/>
```

### Complete Example

```tsx
<RelatedResources
  title="🔗 Related Resources"
  description="Learn more about GitHub integration and link management:"
  className="custom-related-resources"
  links={[
    {
      href: '/docs/core-systems/github-links-system',
      label: '📖 GitHub Links Docs',
      type: 'primary'
    },
    {
      href: '/demos/github-links',
      label: '🎮 Interactive Demo',
      type: 'secondary'
    },
    {
      href: '/docs/configuration/',
      label: '⚙️ Configuration Guide',
      type: 'outline'
    }
  ]}
/>
```

## 🎨 Styling

### Docusaurus Integration

The component uses Docusaurus CSS classes for consistent styling:

- `margin-top--lg`: Top spacing
- `card`: Card container styling
- `shadow--lw`: Light shadow effect
- `card__body`: Card content area
- `text--center`: Center-aligned text
- `margin-bottom--sm/lg`: Spacing utilities
- `text--secondary`: Secondary text color
- `button-group`: Button container
- `button button--*`: Button styling variants

### Custom Styling

You can add custom styles by:

1. **className Prop**: Pass custom CSS classes
2. **CSS Override**: Target the component with CSS
3. **CSS Custom Properties**: Use Docusaurus design tokens

```css
.custom-related-resources {
  /* Custom overrides */
  margin-top: 2rem;
}

.custom-related-resources .card {
  border: 2px solid var(--ifm-color-primary);
}
```

## 🔧 Props Reference

### RelatedResourcesProps

| Prop          | Type                    | Default                  | Description               |
| ------------- | ----------------------- | ------------------------ | ------------------------- |
| `title`       | `string`                | `'🔗 Related Resources'` | Section heading           |
| `description` | `string`                | `undefined`              | Optional description text |
| `links`       | `RelatedResourceLink[]` | Required                 | Array of links to display |
| `className`   | `string`                | `''`                     | Additional CSS classes    |

### RelatedResourceLink

| Prop       | Type                                    | Default     | Description                |
| ---------- | --------------------------------------- | ----------- | -------------------------- |
| `href`     | `string`                                | Required    | URL or path for the link   |
| `label`    | `string`                                | Required    | Display text for the link  |
| `type`     | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Button style variant       |
| `external` | `boolean`                               | `false`     | Whether to open in new tab |

## 🌟 Best Practices

### Content Guidelines

1. **Limit Links**: 2-4 links work best for readability
2. **Clear Labels**: Use descriptive, action-oriented text
3. **Logical Order**: Place most important links first
4. **Consistent Icons**: Use emoji or icons consistently

### Accessibility

- **Descriptive Labels**: Avoid generic text like "Click here"
- **External Link Indication**: Mark external links clearly
- **Keyboard Navigation**: Component supports tab navigation
- **Screen Readers**: Proper semantic HTML structure

### Performance

- **Minimal Footprint**: Lightweight component with no dependencies
- **Static Rendering**: Works with Docusaurus static generation
- **Fast Loading**: Uses optimized Docusaurus CSS classes

## 🔗 Integration Patterns

### Demo Pages

```tsx
// At the end of demo pages
<RelatedResources
  links={[
    {
      href: '/docs/component-name',
      label: '📖 Documentation',
      type: 'primary'
    },
    {
      href: '/demos',
      label: '🎮 More Demos',
      type: 'secondary'
    }
  ]}
/>
```

### Documentation Pages

```tsx
// At the end of doc sections
<RelatedResources
  title="📚 Continue Learning"
  description="Explore these related topics:"
  links={[
    {
      href: '/docs/next-topic',
      label: 'Next: Advanced Usage',
      type: 'primary'
    },
    {
      href: '/docs/related-topic',
      label: 'Related: Configuration',
      type: 'outline'
    }
  ]}
/>
```

### Tutorial Series

```tsx
// Navigation between tutorial steps
<RelatedResources
  title="🚀 Tutorial Navigation"
  links={[
    {
      href: '/tutorial/previous',
      label: '← Previous Step',
      type: 'secondary'
    },
    {
      href: '/tutorial/next',
      label: 'Next Step →',
      type: 'primary'
    }
  ]}
/>
```

## 🔄 Variations and Extensions

### With Icons

Enhance links with consistent emoji or FontAwesome icons:

```tsx
const links = [
  { href: '/docs', label: '📚 Documentation', type: 'primary' },
  { href: '/examples', label: '💡 Examples', type: 'secondary' },
  { href: '/api', label: '🔧 API Reference', type: 'outline' }
];
```

### Conditional Rendering

Show different links based on context:

```tsx
const getLinks = (userType: string) => {
  const baseLinks = [
    { href: '/docs', label: 'Documentation', type: 'primary' }
  ];

  if (userType === 'developer') {
    baseLinks.push({ href: '/api', label: 'API Docs', type: 'secondary' });
  }

  return baseLinks;
};

<RelatedResources links={getLinks('developer')} />;
```

This component provides a consistent, professional way to add contextual navigation throughout your Docusaurus site, improving user experience and site engagement.
