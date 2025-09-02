import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to protect routes/components based on authentication
 * Redirects to login if not authenticated
 */
export function useAuthGuard(redirectTo: string = '/login') {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return isAuthenticated;
}
