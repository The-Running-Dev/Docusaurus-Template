# Tooltip Component

A reusable tooltip component for displaying information on hover with styled tags.

## Features

- **Large, prominent display** - Much larger than browser default tooltips
- **Tag-based layout** - Items displayed as individual styled tags
- **Hover activation** - Shows when hovering over the entire wrapped element
- **Smart positioning** - Automatically chooses best position (top/bottom/left/right) based on screen space
- **No layout disruption** - Uses `display: contents` to maintain original element sizing in grids
- **Responsive design** - Adapts to different screen sizes
- **Theme support** - Works with both light and dark themes
- **Flexible positioning** - Supports manual positioning or auto-detection
- **Smooth animations** - Fade in/out transitions

## Usage

```tsx
import Tooltip from '../Tooltip';

// Basic usage with auto-positioning (recommended)
<Tooltip
  title="CI/CD Tools"
  items={['Docker', 'Jenkins', 'Kubernetes', 'YAML Pipelines']}
  position="auto"
>
  <div className="my-element">
    Hover me to see tooltip
  </div>
</Tooltip>

// With manual positioning
<Tooltip
  title="Frontend Frameworks"
  items={['React', 'Angular', 'Vue.js']}
  position="bottom"
>
  <button>Frontend Tech</button>
</Tooltip>

// No tooltip if items is empty
<Tooltip
  title="Nothing to show"
  items={[]}
>
  <div>No tooltip will appear</div>
</Tooltip>
```

## Props

| Prop        | Type                                               | Default  | Description                                    |
| ----------- | -------------------------------------------------- | -------- | ---------------------------------------------- |
| `children`  | `ReactNode`                                        | required | Content to wrap with tooltip                   |
| `title`     | `string`                                           | required | Title/heading for the tooltip                  |
| `items`     | `string[]`                                         | required | Array of items to display as tags              |
| `position`  | `'top' \| 'bottom' \| 'left' \| 'right' \| 'auto'` | `'auto'` | Tooltip position (auto detects best placement) |
| `className` | `string`                                           | `''`     | Custom CSS class                               |

## Visual Design

```
        Hover Target
            ↑
    ┌─────────────────────┐
    │ Title               │  ← Header with primary color
    ├─────────────────────┤
    │ [Tag1] [Tag2]       │  ← Tags with hover effects
    │ [Tag3] [Tag4] [Tag5]│
    └─────────────────────┘
            ↓
         Arrow
```

## Styling

The component uses CSS custom properties for theming and responds to the `data-theme` attribute for dark mode support.

Key classes:

- `.tooltip-wrapper` - Container wrapper
- `.tooltip` - Main tooltip container
- `.tooltip__content` - Content box
- `.tooltip__header` - Title header
- `.tooltip__tags` - Tags container
- `.tooltip__tag` - Individual tag styling
