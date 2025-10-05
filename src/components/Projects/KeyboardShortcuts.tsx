import React, { useEffect } from 'react';

/**
 * Keyboard shortcuts for admin actions
 */
export const KeyboardShortcuts: React.FC<{
  onShortcut: (action: string) => void;
  isAdmin?: boolean;
}> = ({ onShortcut, isAdmin = false }) => {
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
