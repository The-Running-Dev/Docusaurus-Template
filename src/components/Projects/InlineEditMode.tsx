import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthProvider';

/**
 * Inline quick edit for project title/summary
 * Only available to admin users
 */
export const InlineEditMode: React.FC<{
  value: string;
  onSave: (newValue: string) => void;
  field?: string;
}> = ({ value, onSave, field = 'title' }) => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.roles?.includes('admin');
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value);

  if (!isAdmin) return <span>{value}</span>;

  return editing ? (
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onBlur={() => {
        setEditing(false);
        onSave(input);
      }}
      autoFocus
      className="inline-edit-input"
    />
  ) : (
    <span
      className="inline-edit-value"
      onDoubleClick={() => setEditing(true)}
      title={`Double-click to edit ${field}`}
      style={{ cursor: 'pointer', borderBottom: '1px dashed #888' }}
    >
      {value}
    </span>
  );
};
