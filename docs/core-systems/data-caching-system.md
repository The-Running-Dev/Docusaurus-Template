---
id: data-caching-system
title: Data Caching System
sidebar_position: 5
---

This documentation covers the data loading pipeline and caching mechanisms used throughout the template.

## Overview

The data system provides efficient loading and caching of configuration data with global cache control and per-component validation.

## Architecture

```
YAML Config Files (config/)
    ↓ (pre-build script)
JSON Data Files (data/)
    ↓ (data loader)
Validated Configuration Objects
    ↓ (components)
Rendered UI
```

## Data Loading Pipeline

### 1. Configuration Sources

Configuration is stored in YAML files in the `config/` directory:

```
config/
├── badges.yml          ← Badge configuration
├── features.yml        ← Feature flags
├── giscus.yml         ← Comment system config
├── gitHub.yml         ← GitHub integration
├── gitHubLinks.yml    ← GitHub links
├── globalConfig.yml   ← Global settings
├── projects.yml       ← Projects data
├── themes.yml         ← Theme configuration
└── version.yml        ← Version display config
```

### 2. Data Generation

The pre-build script (`scripts/pre-build.ts`) converts YAML to JSON:

```typescript
// Automatically run before start/build
pnpm run prebuild  // Converts config/*.yml → data/*.json
```

### 3. Data Loading

Components load data using the unified data loader:

```typescript
import { getData } from '../../data/dataLoader';
import { configData } from '../../../data';

// Load and optionally process data
const processedData = getData(configData, {
  cache: true, // Enable caching for this call
  processor: (rawData) => transformData(rawData)
});
```

## Caching System

### Global Cache Configuration

The cache system provides global control over caching behavior:

```typescript
import { DataCacheConfig } from '../../data/dataLoader';

// Check cache status
const isEnabled = DataCacheConfig.isEnabled();

// Enable/disable caching
DataCacheConfig.setFromFeatures(true);

// Clear cache
DataCacheConfig.clear();

// Get cache size
const size = DataCacheConfig.size();
```

### Cache Behavior

- **Disabled by Default**: Caching is disabled by default for fresh data during development
- **Environment-Aware**: Automatically disabled in development environment
- **Feature Integration**: Controlled via global features configuration
- **Per-Call Override**: Individual `getData()` calls can override global settings

### Configuration via Features

Control caching through the global features configuration:

```json
// data/features.json
{
  "dataCaching": false
}
```

### Manual Cache Control

```typescript
// Runtime cache management
DataCacheConfig.setFromFeatures(enableCaching);

// Clear all cached data
DataCacheConfig.clear();

// Check if caching is currently enabled
if (DataCacheConfig.isEnabled()) {
  // Caching is active
}
```

## Data Validation

### Schema Integration

All data is validated using the global schema registry:

```typescript
import { validateData } from '../../schemas';

// Validate data against registered schema
const validatedData = validateData('schemaKey', rawData);
```

### Validation in Components

Components automatically validate data:

```typescript
import { FeatureComponent } from '../FeatureComponent';
import { Features } from '../../config/FeaturesConfig';

<FeatureComponent
  feature={Features.MyFeature}
  configData={myConfigData}
  processor={(rawData) => {
    // Data is automatically validated using component's schema
    return processData(rawData);
  }}
>
  {(validatedData) => (
    // Render with guaranteed valid data
    <MyComponent data={validatedData} />
  )}
</FeatureComponent>
```

## Data Loading Patterns

### Basic Data Loading

```typescript
import { getData } from '../../data/dataLoader';

function MyComponent() {
  const config = getData(configData);

  return <div>{config.property}</div>;
}
```

### With Processing

```typescript
const processedConfig = getData(configData, {
  processor: (raw) => ({
    ...raw,
    computedValue: calculateValue(raw.input),
    formattedDate: new Date(raw.date).toLocaleDateString()
  })
});
```

### With Caching Override

```typescript
// Force caching for this call
const config = getData(configData, { cache: true });

// Force no caching for this call
const freshConfig = getData(configData, { cache: false });
```

### Async Data Loading

```typescript
import { useState, useEffect } from 'react';

function AsyncDataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getData(configData, {
          processor: async (raw) => {
            // Async processing
            const processed = await processDataAsync(raw);
            return processed;
          }
        });
        setData(result);
      } catch (error) {
        console.error('Data loading failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

## Performance Optimization

### Caching Strategy

1. **Development**: Caching disabled for fresh data
2. **Production**: Caching enabled for performance
3. **Per-Component**: Components can override global cache settings
4. **Memory Management**: Cache can be cleared when needed

### Data Processing

1. **Lazy Processing**: Data is processed only when needed
2. **Memoization**: Expensive computations are cached
3. **Incremental Loading**: Large datasets can be loaded incrementally
4. **Error Boundaries**: Failed processing doesn't crash the app

## Configuration Data Types

### Global Configuration

```typescript
interface GlobalConfig {
  siteName: string;
  siteUrl: string;
  author: string;
  email: string;
  social: Record<string, string>;
}
```

### Feature Flags

```typescript
interface FeaturesConfig {
  giscusComments: boolean;
  gitHubLinks: boolean;
  navBarLinks: boolean;
  themeSwitcher: boolean;
  // ... other features
}
```

### Theme Configuration

```typescript
interface ThemesConfig {
  defaultTheme?: string;
  themes: Array<{
    name: string;
    displayName: string;
    cssFile: string;
  }>;
}
```

## Best Practices

### Data Loading

1. **Always validate data** using schemas
2. **Handle loading states** in components
3. **Use caching appropriately** for performance
4. **Process data close to usage** to minimize memory
5. **Implement error handling** for data failures

### Caching

1. **Disable during development** for fresh data
2. **Enable in production** for performance
3. **Clear cache when needed** to free memory
4. **Monitor cache size** to prevent memory leaks
5. **Use per-call overrides** for special cases

### Configuration Management

1. **Store configuration in YAML** for readability
2. **Generate JSON during build** for performance
3. **Validate all configuration** at build time
4. **Use TypeScript interfaces** for type safety
5. **Document configuration schema** for maintainability

## Troubleshooting

### Common Issues

**Data not updating in development:**

- Check if caching is disabled: `DataCacheConfig.isEnabled()`
- Clear cache manually: `DataCacheConfig.clear()`

**Validation errors:**

- Check schema registration: `hasSchema('yourSchemaKey')`
- Validate data structure against schema
- Check for required fields

**Performance issues:**

- Enable caching in production
- Use data processing efficiently
- Monitor cache size and clear when needed

**Build failures:**

- Run pre-build script manually: `pnpm run prebuild`
- Check YAML syntax in config files
- Validate schemas before build
