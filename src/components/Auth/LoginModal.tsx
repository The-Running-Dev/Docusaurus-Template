import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthProvider';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  // Focus username input when modal opens
  useEffect(() => {
    if (isOpen && usernameInputRef.current) {
      // Small delay to ensure the modal is fully rendered
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await login(username, password);

    setLoading(false);

    if (!error) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            ref={usernameInputRef}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
