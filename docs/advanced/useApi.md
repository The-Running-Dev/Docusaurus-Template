---
id: useApi
title: API Hook
sidebar_position: 6
---

A React hook for fetching project data from an API endpoint. **Disabled by default** for security and performance reasons.

## Features

- **Disabled by default** - Must be explicitly enabled via feature flags and configuration
- **Automatic retry logic** with configurable attempts and delays
- **Loading, error, and success states**
- **Manual refetch capability**
- **TypeScript support** with full type inference
- **Configurable request options**
- **Feature flag integration**

## Basic Usage

```tsx
import React from 'react';
import { useApi } from '../hooks/useApi';

const ProjectsComponent: React.FC = () => {
  const { data, loading, error, enabled, refetch } = useApi({
    endpoint: '/api/projects',
    enabled: true // Must explicitly enable
  });

  if (!enabled) {
    return <div>API fetching is disabled</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Projects</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
};
```

## Configuration

### Hook Options

```tsx
interface UseApiConfig {
  enabled?: boolean; // Disabled by default
  endpoint?: string; // API endpoint URL
  options?: RequestInit; // Fetch options
  autoFetch?: boolean; // Auto-fetch on mount (default: true)
  retryAttempts?: number; // Retry attempts (default: 3)
  retryDelay?: number; // Retry delay in ms (default: 1000)
}
```

### Enabling API Fetching

To enable the API fetching functionality, simply pass `enabled: true` to the hook:

```tsx
const { data, loading, error } = useApi({
  enabled: true,
  endpoint: '/api/projects'
});
```

## Advanced Usage

### With Custom Options

```tsx
const { data, loading, error } = useApi({
  enabled: true,
  endpoint: '/api/projects',
  options: {
    method: 'POST',
    headers: {
      Authorization: 'Bearer token',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filter: 'active' })
  },
  retryAttempts: 5,
  retryDelay: 2000
});
```

### Manual Fetching

```tsx
const { data, loading, refetch, reset } = useApi({
  enabled: true,
  endpoint: '/api/projects',
  autoFetch: false // Don't fetch automatically
});

// Later in your component
const handleFetch = async () => {
  await refetch();
};

const handleReset = () => {
  reset();
};
```

## Return Values

```tsx
interface UseApiState<T = any> {
  data: T | null; // API response data
  loading: boolean; // Loading state
  error: Error | null; // Error state
  enabled: boolean; // Whether API is enabled
  refetch: () => Promise<void>; // Manual refetch function
  reset: () => void; // Reset state function
}
```

## Security Considerations

- **Disabled by default** to prevent accidental API calls
- Requires explicit feature flag activation
- Supports custom headers for authentication
- Error messages are safely handled and displayed

## Example API Response

Expected format for project data:

```json
[
  {
    "category": "Frontend",
    "subCategories": [
      {
        "name": "React",
        "projects": [
          {
            "title": "Project Name",
            "summary": "Project description",
            "link": "https://github.com/user/project",
            "lastModified": "2025-08-13T10:00:00.000Z",
            "tags": ["React", "TypeScript"]
          }
        ]
      }
    ]
  }
]
```
