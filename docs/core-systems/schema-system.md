---
id: schema-system
title: Schema System
sidebar_position: 11
---

## Overview

The schema system has been completely reorganized to provide a clean, distributed architecture where each component manages its own validation schema while maintaining a global registry for centralized validation.

## Architecture

### Before (Centralized)

```
src/components/GitHubInfo/schemas.ts  ← All schemas in one file
```

### After (Distributed)

```
src/
├── components/
│   ├── ThemeSwitcher/
│   │   ├── schema.ts           ← Component-specific schema
│   │   └── index.ts            ← Exports schema
│   ├── NavBarLinks/
│   │   ├── schema.ts
│   │   └── index.ts
│   ├── Badges/
│   │   ├── schema.ts
│   │   └── index.ts
│   ├── GitHubInfo/
│   │   ├── schema.ts
│   │   └── index.ts
│   ├── VersionDisplay/
│   │   ├── schema.ts
│   │   └── index.ts
│   └── Projects/
│       ├── schema.ts
│       └── index.ts
├── config/
│   └── FeaturesConfig/
│       ├── schema.ts
│       └── index.ts
└── schemas/
    └── index.ts                ← Global registry & validation
```

## Component Schema Structure

Each component schema follows a consistent pattern:

```typescript
/**
 * [Component] Schema
 *
 * Validation schema for [component] configuration data
 */

import { z } from 'zod';

// Define your schemas
export const SomeSchema = z.object({
  field: z.string()
  // ... other fields
});

// Export the main schema with consistent naming
export const componentSchema = SomeSchema;
export const schemaKey = 'schemaKeyName';
```

## Global Registry

The global registry automatically imports and registers all component schemas:

```typescript
import {
  validateData,
  registerSchema,
  getSchema,
  hasSchema,
  getRegisteredKeys
} from '../schemas';
```

## Usage Examples

### Basic Validation

```typescript
import { validateData } from '../schemas';

const themeData = {
  defaultTheme: 'light',
  themes: [{ name: 'light', displayName: 'Light Mode', cssFile: 'light.css' }]
};

const validated = validateData('themes', themeData);
```

### Check Available Schemas

```typescript
import { getRegisteredKeys, hasSchema } from '../schemas';

console.log('Available schemas:', getRegisteredKeys());
console.log('Has themes schema:', hasSchema('themes'));
```

### Dynamic Registration

```typescript
import { registerSchema } from '../schemas';
import { z } from 'zod';

const CustomSchema = z.object({ id: z.string() });
registerSchema('custom', CustomSchema);
```

## Registered Schemas

The following schemas are automatically registered:

| Schema Key    | Component      | Description                 |
| ------------- | -------------- | --------------------------- |
| `themes`      | ThemeSwitcher  | Theme configuration         |
| `navbarLinks` | NavBarLinks    | Navbar links configuration  |
| `badgeConfig` | Badges         | Badge system configuration  |
| `github`      | GitHubInfo     | GitHub integration config   |
| `version`     | VersionDisplay | Version display config      |
| `projects`    | Projects       | Projects page configuration |
| `Features`    | FeaturesConfig | Feature flags configuration |

## Package Scripts

- `pnpm run test:schemas` - Test the schema system
- `pnpm run validate:github` - Validate GitHub configuration
- `pnpm run quality` - Includes schema validation in quality checks

## Benefits

### ✅ **Distributed Ownership**

Each component owns its schema, making it easier to maintain and update.

### ✅ **Automatic Registration**

No manual registration needed - schemas are discovered and registered automatically.

### ✅ **Type Safety**

Full TypeScript integration with proper type inference.

### ✅ **Consistent API**

Uniform interface for validation across all components.

### ✅ **Better Error Messages**

Detailed validation errors with field-specific information.

### ✅ **Debugging Support**

Built-in tools to inspect registry and debug validation issues.

## Migration from Old System

If you have existing code using the old centralized schema system:

### Old Way

```typescript
import { validateData, registerSchema } from '../components/GitHubInfo/schemas';
```

### New Way

```typescript
import { validateData, registerSchema } from '../schemas';
```

The API remains the same, only the import path changes!

## Adding New Schemas

To add a new schema for a component:

1. **Create `schema.ts` in your component directory**:

```typescript
import { z } from 'zod';

export const YourComponentSchema = z.object({
  // Define your schema
});

export const componentSchema = YourComponentSchema;
export const schemaKey = 'yourComponentKey';
```

2. **Export from component's `index.ts`**:

```typescript
export * from './schema';
```

3. **Add to global registry** (`src/schemas/index.ts`):

```typescript
import * as yourComponentSchema from '../components/YourComponent/schema';

const schemaModules = [
  // ... existing schemas
  yourComponentSchema
];
```

That's it! Your schema is now automatically registered and available globally.
