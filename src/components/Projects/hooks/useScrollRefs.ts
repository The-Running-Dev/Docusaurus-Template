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
      // First scroll to get the position
      const element = projectsRef.current;
      const rect = element.getBoundingClientRect();
      const absoluteTop = rect.top + window.pageYOffset;

      // Add offset to account for sticky header/navbar (adjust as needed)
      const offset = 20; // pixels

      window.scrollTo({
        top: absoluteTop - offset,
        behavior: 'smooth'
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
