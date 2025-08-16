---
id: hooks-system
title: Custom Hooks
sidebar_position: 8
---

This documentation covers the custom React hooks available in the template.

## Available Hooks

### useApi

A comprehensive hook for fetching data from API endpoints with built-in retry logic, error handling, and feature flag integration.

**Key Features:**

- **Disabled by default** for security
- Automatic retry with configurable attempts
- Loading and error state management
- Feature flag integration
- TypeScript support

**Basic Usage:**

```tsx
import { useApi } from '../hooks/useApi';

const { data, loading, error, enabled } = useApi({
  endpoint: '/api/projects',
  enabled: true // Must explicitly enable
});

if (!enabled) {
  return <div>API integration disabled</div>;
}

if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>Error: {error}</div>;
}

return <div>{JSON.stringify(data)}</div>;
```

**Configuration Options:**

```tsx
const { data, loading, error, enabled } = useApi({
  endpoint: '/api/projects',
  enabled: true,
  retries: 3,
  retryDelay: 1000,
  headers: {
    Authorization: 'Bearer token'
  }
});
```

### useFeatureFlag

Provides access to feature flag state with real-time updates.

**Usage:**

```tsx
import { useFeatureFlag, Features } from '../config/FeaturesConfig';

function MyComponent() {
  const isEnabled = useFeatureFlag(Features.MyFeature);

  if (!isEnabled) {
    return null;
  }

  return <div>Feature is enabled!</div>;
}
```

### useGitHubConfig

Provides access to GitHub configuration with validation and type safety.

**Usage:**

```tsx
import { useGitHubConfig } from '../config/GitHubConfig';

function GitHubComponent() {
  const { config, urls, metadata, repositoryInfo, loading, error } =
    useGitHubConfig();

  if (loading) return <div>Loading GitHub config...</div>;
  if (error) return <div>Error loading config: {error}</div>;

  return (
    <div>
      <h2>{metadata.description}</h2>
      <a href={urls.repository}>{repositoryInfo.repo}</a>
    </div>
  );
}
```

**Available Properties:**

- `config` - Complete GitHub configuration object
- `urls` - All GitHub URLs (repository, issues, releases, etc.)
- `metadata` - Project metadata (license, topics, description)
- `repositoryInfo` - Repository info (repo, organization, project)
- `loading` - Loading state boolean
- `error` - Error message string or null

## Hook Patterns

### Data Loading Hook Pattern

Most data-loading hooks follow this pattern:

```tsx
import { useState, useEffect } from 'react';
import { validateData } from '../schemas';

function useDataLoader<T>(key: string, rawData: any) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const validated = validateData<T>(key, rawData);
      setData(validated);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [key, rawData]);

  return { data, loading, error };
}
```

### Feature Flag Integration Pattern

Hooks that depend on feature flags follow this pattern:

```tsx
import { useFeatureFlag, Features } from '../config/FeaturesConfig';

function useMyFeature() {
  const isEnabled = useFeatureFlag(Features.MyFeature);

  // Return disabled state if feature is off
  if (!isEnabled) {
    return {
      enabled: false,
      data: null,
      loading: false,
      error: null
    };
  }

  // Feature-specific logic here
  const result = useDataLoader(/* ... */);

  return {
    enabled: true,
    ...result
  };
}
```

## Best Practices

1. **Always handle loading states** in data-fetching hooks
2. **Use proper error boundaries** for hook errors
3. **Implement feature flag checks** for conditional hooks
4. **Validate data** using the schema system
5. **Use TypeScript generics** for type safety
6. **Handle cleanup** in useEffect hooks
7. **Memoize expensive computations** with useMemo
8. **Debounce API calls** for performance
9. **Cache results** when appropriate
10. **Test hooks** with React Testing Library

## Hook Directory Structure

```
src/hooks/
├── useApi.ts              ← API fetching hook
├── useFeatureFlag.ts      ← Feature flag hook
├── useGitHubConfig.ts     ← GitHub config hook
├── useLocalStorage.ts     ← Local storage hook
├── useDebounce.ts         ← Debouncing utility hook
└── index.ts               ← Hook exports
```

## Testing Hooks

Use React Testing Library's `renderHook` for testing:

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from '../useApi';

test('useApi returns data on success', async () => {
  const { result } = renderHook(() =>
    useApi({ endpoint: '/api/test', enabled: true })
  );

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
});
```
