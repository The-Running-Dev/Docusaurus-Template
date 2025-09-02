import React from 'react';
import { useAuth } from '../Auth/AuthProvider';

/**
 * Bulk actions toolbar for admin users
 */
export const BulkActionsToolbar: React.FC<{
  selected: string[];
  onAction: (action: string) => void;
}> = ({ selected, onAction }) => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.roles?.includes('admin');

  if (!isAdmin || selected.length === 0) return null;

  return (
    <div className="bulk-actions-toolbar">
      <button onClick={() => onAction('delete')}>Delete</button>
      <button onClick={() => onAction('move')}>Move Category</button>
      <button onClick={() => onAction('tag')}>Change Tags</button>
      {/* Add more bulk actions as needed */}
    </div>
  );
};
