import { useAuth } from '../components/Auth/AuthProvider';
import { useCallback } from 'react';

function safeGetAccessToken(): string {
  try {
    if (typeof window === 'undefined') return '';
    const storage = (globalThis as any).localStorage;
    if (!storage || typeof storage.getItem !== 'function') return '';
    return storage.getItem('accessToken') || '';
  } catch {
    return '';
  }
}

/**
 * Hook for making authenticated API requests with automatic token refresh
 */
export const useAuthenticatedFetch = () => {
  const { refresh } = useAuth();

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const token = safeGetAccessToken();

      // Add Authorization header if token exists
      const headers = {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const requestOptions: RequestInit = {
        ...options,
        headers,
        credentials: 'include'
      };

      let response = await fetch(url, requestOptions);

      // If unauthorized and we have a token, try to refresh it
      if (response.status === 401 && token) {
        console.log('Received 401, attempting token refresh...');

        const refreshSuccess = await refresh();
        if (refreshSuccess) {
          console.log('Token refreshed successfully, retrying request...');

          // Get the new token and retry the request
          const newToken = safeGetAccessToken();
          const newHeaders = {
            ...options.headers,
            ...(newToken && { Authorization: `Bearer ${newToken}` })
          };

          const retryOptions: RequestInit = {
            ...options,
            headers: newHeaders,
            credentials: 'include'
          };

          response = await fetch(url, retryOptions);
        } else {
          console.log('Token refresh failed, redirecting to login...');
          // Refresh failed, the AuthProvider will have cleared the state
        }
      }

      return response;
    },
    [refresh]
  );

  return { authenticatedFetch };
};
