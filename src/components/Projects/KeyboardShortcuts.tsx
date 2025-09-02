import React, { useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';

/**
 * Keyboard shortcuts for admin actions
 */
export const KeyboardShortcuts: React.FC<{
  onShortcut: (action: string) => void;
}> = ({ onShortcut }) => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.roles?.includes('admin');

  useEffect(() => {
    if (!isAdmin) return;
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'e') {
        onShortcut('edit');
      }
      if (e.ctrlKey && e.key === 'b') {
        onShortcut('bulk');
      }
      // Add more shortcuts as needed
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isAdmin, onShortcut]);

  return null;
};
