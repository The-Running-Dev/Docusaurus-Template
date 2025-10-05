import React from 'react';
import { useAuth } from '../Auth/AuthProvider';

/**
 * Debug component to check authentication status
 */
export function AuthDebug(): React.ReactNode {
  const { user, isAuthenticated, isInitializing } = useAuth();

  // Client-side only token check
  const hasAccessToken =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken') !== null
      : false;

  return (
    <div
      style={{
        border: '2px solid #00a8ff',
        padding: '1rem',
        margin: '1rem',
        borderRadius: '8px',
        backgroundColor: '#f0f8ff'
      }}
    >
      <h3>🔍 Authentication Debug</h3>
      <div>
        <strong>Is Initializing:</strong> {isInitializing ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}
      </div>
      <div>
        <strong>User Roles:</strong>{' '}
        {user?.roles ? JSON.stringify(user.roles) : 'None'}
      </div>
      <div>
        <strong>Has Admin Role:</strong>{' '}
        {user?.roles?.includes('admin') ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Access Token:</strong> {hasAccessToken ? 'Present' : 'Missing'}
      </div>
    </div>
  );
}
