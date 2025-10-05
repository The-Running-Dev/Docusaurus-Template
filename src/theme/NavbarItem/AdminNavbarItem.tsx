import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faUser,
  faSignOutAlt,
  faLock,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../components/Auth/AuthProvider';
import { useFeaturesConfig } from '../../config/FeaturesConfig';
import './AdminNavbarItem.css';

const AdminNavbarItem: React.FC = () => {
  const featuresConfig = useFeaturesConfig();
  const { user, isAuthenticated, isInitializing, logout, login, error } =
    useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  // Check if user is admin (only after auth is initialized)
  const isAdmin =
    !isInitializing && isAuthenticated && user?.roles?.includes('admin');

  // Focus username input when dropdown opens for login
  useEffect(() => {
    if (dropdownOpen && !isAuthenticated && usernameInputRef.current) {
      // Small delay to ensure the dropdown is fully rendered
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
    }
  }, [dropdownOpen, isAuthenticated]);

  // Don't render if Admin UI is disabled
  if (!featuresConfig.adminUI) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await login(username, password);

    setLoading(false);

    if (!error) {
      setDropdownOpen(false);

      setUsername('');

      setPassword('');
    }
  };

  const handleLogout = () => {
    logout();

    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);

    // Reset form when closing
    if (dropdownOpen) {
      setUsername('');

      setPassword('');
    }
  };

  return (
    <div className="admin-navbar-item">
      <button
        className="admin-navbar-button"
        onClick={toggleDropdown}
        aria-label={
          isInitializing
            ? 'Initializing Auth...'
            : isAuthenticated
              ? isAdmin
                ? 'Admin Menu'
                : 'User Menu'
              : 'Admin Login'
        }
        title={
          isInitializing
            ? 'Checking authentication status...'
            : isAuthenticated
              ? `Logged in as ${user?.username}`
              : 'Admin Login'
        }
      >
        <FontAwesomeIcon
          icon={
            isInitializing
              ? faSpinner
              : isAuthenticated
                ? isAdmin
                  ? faCog
                  : faUser
                : faLock
          }
          className={`admin-navbar-icon ${isInitializing ? 'fa-spin' : ''}`}
        />
        {isAdmin && <span className="admin-badge">Admin</span>}
      </button>

      {dropdownOpen && (
        <>
          <div
            className="admin-dropdown-overlay"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="admin-dropdown">
            {isAuthenticated ? (
              <>
                <div className="admin-dropdown-header">
                  <FontAwesomeIcon icon={faUser} />
                  <span>{user?.username}</span>
                  {isAdmin && <span className="admin-role-badge">Admin</span>}
                </div>
                <button className="admin-dropdown-item" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Logout
                </button>
              </>
            ) : (
              <form className="admin-login-form" onSubmit={handleLogin}>
                <div className="admin-form-header">
                  <FontAwesomeIcon icon={faLock} />
                  <span>Admin Login</span>
                </div>

                <div className="admin-form-field">
                  <input
                    ref={usernameInputRef}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>

                <div className="admin-form-field">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                {error && <div className="admin-form-error">{error}</div>}

                <button
                  type="submit"
                  className="admin-form-submit"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminNavbarItem;
