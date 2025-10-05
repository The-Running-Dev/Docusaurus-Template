import React, { useState, useEffect, useRef } from 'react';

interface SmartSelectorProps {
  type: 'category' | 'subcategory' | 'tags';
  value: string | string[];
  options: string[];
  onSelect: (value: string | string[]) => void;
  onAddNew: (value: string) => void;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  dependsOn?: string; // for subcategory filtering
}

/**
 * Smart dropdown selector with "Add New" functionality
 * Supports both single and multi-select modes
 */
export function SmartSelector({
  type,
  value,
  options,
  onSelect,
  onAddNew,
  placeholder,
  multiple = false,
  disabled = false
}: SmartSelectorProps): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);
  const [newValue, setNewValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term and dependencies
  const filteredOptions = options.filter((option) => {
    if (
      searchTerm &&
      !option.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    // Additional filtering logic could be added here for dependsOn
    return true;
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowAddNew(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectOption = (option: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(option)) {
        // Remove if already selected
        onSelect(currentValues.filter((v) => v !== option));
      } else {
        // Add to selection
        onSelect([...currentValues, option]);
      }
    } else {
      onSelect(option);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleAddNew = () => {
    if (newValue.trim()) {
      onAddNew(newValue.trim());
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        onSelect([...currentValues, newValue.trim()]);
      } else {
        onSelect(newValue.trim());
      }
      setNewValue('');
      setShowAddNew(false);
      if (!multiple) {
        setIsOpen(false);
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (multiple && Array.isArray(value)) {
      onSelect(value.filter((v) => v !== tagToRemove));
    }
  };

  const displayValue = () => {
    if (multiple && Array.isArray(value)) {
      return value.length > 0
        ? `${value.length} selected`
        : placeholder || 'Select...';
    }
    return value || placeholder || 'Select...';
  };

  return (
    <div
      className={`smart-selector smart-selector--${type}`}
      ref={containerRef}
    >
      {/* Selected Tags Display (for multiple mode) */}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="smart-selector-tags">
          {value.map((tag) => (
            <span key={tag} className="smart-selector-tag">
              {tag}
              <button
                type="button"
                className="smart-selector-tag-remove"
                onClick={() => handleRemoveTag(tag)}
                title={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Main Selector Button */}
      <button
        type="button"
        className={`smart-selector-button ${isOpen ? 'open' : ''}`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
        disabled={disabled}
      >
        <span className="smart-selector-value">{displayValue()}</span>
        <span className="smart-selector-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="smart-selector-dropdown">
          {/* Search Input */}
          <div className="smart-selector-search">
            <input
              ref={inputRef}
              type="text"
              className="smart-selector-search-input"
              placeholder={`Search ${type}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Options List */}
          <div className="smart-selector-options">
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`smart-selector-option ${
                  multiple && Array.isArray(value) && value.includes(option)
                    ? 'selected'
                    : ''
                } ${!multiple && value === option ? 'selected' : ''}`}
                onClick={() => handleSelectOption(option)}
              >
                {multiple && (
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(option)}
                    readOnly
                    className="smart-selector-checkbox"
                  />
                )}
                <span>{option}</span>
              </button>
            ))}

            {filteredOptions.length === 0 && searchTerm && (
              <div className="smart-selector-no-results">
                No {type} found matching "{searchTerm}"
              </div>
            )}
          </div>

          {/* Add New Section */}
          <div className="smart-selector-add-new">
            {!showAddNew ? (
              <button
                type="button"
                className="smart-selector-add-button"
                onClick={() => {
                  setShowAddNew(true);
                  setNewValue(searchTerm);
                }}
              >
                + Add New{' '}
                {type === 'tags'
                  ? 'Tag'
                  : type === 'category'
                    ? 'Category'
                    : 'Subcategory'}
              </button>
            ) : (
              <div className="smart-selector-add-form">
                <input
                  type="text"
                  className="smart-selector-add-input"
                  placeholder={`Enter new ${type}...`}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNew();
                    } else if (e.key === 'Escape') {
                      setShowAddNew(false);
                      setNewValue('');
                    }
                  }}
                  autoFocus
                />
                <div className="smart-selector-add-actions">
                  <button
                    type="button"
                    className="button button--sm button--primary"
                    onClick={handleAddNew}
                    disabled={!newValue.trim()}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="button button--sm"
                    onClick={() => {
                      setShowAddNew(false);
                      setNewValue('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
