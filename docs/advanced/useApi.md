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
  /** API endpoint URL */
  endpoint?: string;

  /** Request options */
  options?: RequestInit;

  /** Auto-fetch on mount */
  autoFetch?: boolean;

  /** Retry attempts on failure */
  retryAttempts?: number;

  /** Retry delay in milliseconds */
  retryDelay?: number;
}
```

### Default Configuration

The useApi hook now has improved default configuration:

```tsx
const DEFAULT_CONFIG: Required<UseApiConfig> = {
  endpoint: '',
  options: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  autoFetch: true,
  retryAttempts: 3,
  retryDelay: 1000
};
```

### Simple API Calls

```tsx
const { data, loading, error, refetch, reset } = useApi({
  endpoint: '/api/projects'
});
```

## Advanced Usage

### Enhanced Error Handling and Cleanup

The useApi hook now includes improved error handling and cleanup:

```tsx
const { data, loading, error, refetch, reset } = useApi({
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

### Cleanup and Abort Handling

The hook now automatically handles:

- **Request Abortion**: Automatic cleanup when component unmounts
- **Memory Leak Prevention**: Proper cleanup of timeouts and references
- **Mount State Checking**: Prevents state updates on unmounted components

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
  refetch: () => Promise<void>; // Manual refetch function
  reset: () => void; // Reset state function
}
```

### Enhanced Error Handling

The hook now provides improved error handling:

- **AbortError Handling**: Gracefully handles request cancellation
- **Component Mount Checking**: Prevents state updates after unmount
- **Memory Leak Prevention**: Automatic cleanup of resources

## Security Considerations

- **Request Cancellation**: All requests are automatically cancelled when components unmount
- **Memory Safety**: Proper cleanup prevents memory leaks and zombie requests
- **Error Boundary**: Safe error handling prevents application crashes
- **Request Isolation**: Each hook instance manages its own abort controller

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
