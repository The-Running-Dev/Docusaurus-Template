import { useRef } from 'react';

/**
 * Custom hook for managing scroll references and scroll behavior
 * Provides smooth scrolling functionality for navigation between sections
 */
export function useScrollRefs() {
  const filtersRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  const scrollToProjects = () => {
    if (projectsRef.current) {
      projectsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToFilters = () => {
    if (filtersRef.current) {
      filtersRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return {
    filtersRef,
    projectsRef,
    scrollToProjects,
    scrollToFilters
  };
}
