import { useState, useRef, useEffect } from 'react';

interface UseSearchOptions {
  persistKey?: string;
  autoFocus?: boolean;
}

/**
 * Custom hook for managing search functionality
 * Handles search input, clear functionality, focus management, and keyboard shortcuts
 */
export function useSearch(options: UseSearchOptions = {}) {
  const { persistKey, autoFocus = true } = options;
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window === 'undefined' || !persistKey) return '';
    try {
      return localStorage.getItem(persistKey) || '';
    } catch {
      return '';
    }
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus on search input on page load
  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle escape key to clear search
  const searchTermRef = useRef(searchTerm);

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && searchTermRef.current) {
        handleClearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClearSearch = () => {
    setSearchTerm('');

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Persist search term
  useEffect(() => {
    if (!persistKey || typeof window === 'undefined') return;
    try {
      if (searchTerm) localStorage.setItem(persistKey, searchTerm);
      else localStorage.removeItem(persistKey);
    } catch { /* ignore */ void 0; }
  }, [searchTerm, persistKey]);

  return {
    searchTerm,
    setSearchTerm,
    searchInputRef,
    handleClearSearch
  };
}
