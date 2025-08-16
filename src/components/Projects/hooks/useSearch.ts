import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook for managing search functionality
 * Handles search input, clear functionality, focus management, and keyboard shortcuts
 */
export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus on search input on page load
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

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

  return {
    searchTerm,
    setSearchTerm,
    searchInputRef,
    handleClearSearch
  };
}
