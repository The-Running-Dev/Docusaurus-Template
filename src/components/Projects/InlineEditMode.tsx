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
  const { user, isAuthenticated, isInitializing } = useAuth();
  const isAdmin = isAuthenticated && user?.roles?.includes('admin');
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value);

  // Don't render admin controls until authentication is fully initialized
  if (isInitializing) return <span>{value}</span>;
  if (!isAdmin) return <span>{value}</span>;

  const handleSave = () => {
    setEditing(false);
    onSave(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setInput(value);
      setEditing(false);
    } else if (
      e.key === 'Enter' &&
      field !== 'summary' &&
      field !== 'description'
    ) {
      // Only allow Enter to save for title fields, not multi-line summary/description
      handleSave();
    }
  };

  return editing ? (
    field === 'summary' || field === 'description' ? (
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        className="inline-edit-input"
        rows={3}
        style={{ resize: 'vertical', minHeight: '60px' }}
      />
    ) : (
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        className="inline-edit-input"
      />
    )
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
