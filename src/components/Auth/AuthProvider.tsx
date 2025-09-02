import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import jwtDecode from 'jwt-decode';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);

  // Fetch current user info on mount
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const login = async (username: string, password: string) => {
    setError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setIsAuthenticated(true);
    } else {
      setError('Login failed');
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    setIsAuthenticated(false);
  };

  const refresh = async () => {
    await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });
    // Optionally re-fetch user info
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, refresh, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
