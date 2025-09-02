import React from 'react';
import { useAuth } from '../Auth/AuthProvider';

/**
 * Admin overlay for project cards and bulk actions
 * Only visible to authenticated admin users
 */
export const AdminOverlay: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.roles?.includes('admin');

  if (!isAdmin) return null;

  return (
    <div className="admin-overlay">
      {children}
      {/* Add admin controls here: bulk actions, quick edit, tabs modal, etc. */}
    </div>
  );
};
