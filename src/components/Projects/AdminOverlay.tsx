import React from 'react';

/**
 * Admin overlay for project cards and bulk actions
 * Only visible to admin users
 */
export const AdminOverlay: React.FC<{ 
  children: React.ReactNode;
  isAdmin?: boolean;
}> = ({
  children,
  isAdmin = false
}) => {
  if (!isAdmin) return null;

  return (
    <div className="admin-overlay">
      {children}
      {/* Add admin controls here: bulk actions, quick edit, tabs modal, etc. */}
    </div>
  );
};
