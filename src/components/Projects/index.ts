// Main component - now uses the new architecture
export { default } from './Projects';
export { default as ProjectsManager } from './ProjectsManager';
export { default as ProjectsAdmin } from './ProjectsAdmin';
export { default as ProjectsDisplay } from './ProjectsDisplay';

// Models and configuration
export * from './models';

// Hooks (for external use if needed)
export { useSearch, useScrollRefs, useUrlFilter } from './hooks';

// Components (for external use if needed)
export {
  FilterButton,
  SearchBox,
  ProjectHeader,
  ProjectStats
} from './components';

// Utils (for external use if needed)
export { calculateCategoryResults, calculateTechnologyResults } from './utils';

// Constants (for external use if needed)
export * from './constants';
