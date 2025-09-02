import React from 'react';
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';

/**
 * Wrapper for protected routes/components
 * Renders children if authenticated, otherwise redirects to login
 */
export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }
  return <>{children}</>;
};
