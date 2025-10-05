import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { isTokenExpired, isTokenExpiringSoon } from '../../utils/jwtUtils';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);

          // Verify the new token to get user info
          const userRes = await fetch('http://localhost:4000/api/auth/me', {
            headers: { Authorization: `Bearer ${data.accessToken}` },
            credentials: 'include'
          });

          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData && userData.user) {
              setUser(userData.user);
              setIsAuthenticated(true);
              return true;
            }
          }
        }
      }

      // Refresh failed, clear everything
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Load token from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Check if token is expired before making API call
          if (isTokenExpired(token)) {
            console.log(
              'Stored access token is expired, attempting refresh...'
            );
            const refreshSuccess = await refresh();
            if (!refreshSuccess) {
              console.log('Refresh failed, user needs to login again');
            }
            return;
          }

          // Check if token is expiring soon and refresh proactively
          if (isTokenExpiringSoon(token)) {
            console.log(
              'Access token expiring soon, refreshing proactively...'
            );
            const refreshSuccess = await refresh();
            if (refreshSuccess) {
              return; // New token is set, no need to verify old one
            }
            // If refresh failed, continue with current token verification
          }

          // Verify the token by fetching user info
          try {
            const res = await fetch('http://localhost:4000/api/auth/me', {
              headers: { Authorization: `Bearer ${token}` },
              credentials: 'include'
            });

            if (res.ok) {
              const data = await res.json();
              if (data && data.user) {
                setUser(data.user);
                setIsAuthenticated(true);
                return;
              }
            }

            // Token is invalid, try to refresh
            console.log('Access token invalid, attempting refresh...');
            const refreshSuccess = await refresh();
            if (!refreshSuccess) {
              console.log('Refresh failed, user needs to login again');
            }
          } catch (error) {
            console.error('Auth initialization error:', error);
            // Try refresh as fallback
            const refreshSuccess = await refresh();
            if (!refreshSuccess) {
              localStorage.removeItem('accessToken');
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        }
      } finally {
        // Always set initializing to false when done, regardless of success/failure
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // Set up periodic token refresh check
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      async () => {
        const token = localStorage.getItem('accessToken');
        if (token && isTokenExpiringSoon(token, 10)) {
          // Refresh 10 minutes before expiry
          console.log('Token expiring soon, refreshing automatically...');
          await refresh();
        }
      },
      5 * 60 * 1000
    ); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (username: string, password: string) => {
    setError(null);

    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      const data = await res.json();
      const token = data.accessToken;

      // Store the access token
      localStorage.setItem('accessToken', token);

      setUser(data.user);

      setIsAuthenticated(true);
    } else {
      setError('Login Failed');

      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    await fetch('http://localhost:4000/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });

    // Clear stored token
    localStorage.removeItem('accessToken');

    setUser(null);

    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isInitializing,
        login,
        logout,
        refresh,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
