/**
 * Projects Module
 *
 * A comprehensive project showcase component with filtering, searching, and categorization
 * using the new data provider architecture
 *
 * Structure:
 * - components/: Reusable UI components (FilterButton, SearchBox, etc.)
 * - hooks/: Custom React hooks for state management
 * - utils/: Utility functions and calculations
 * - models.ts: Data models and interfaces
 * - Projects.tsx: Main component using new architecture
 * - BaseProjects.tsx: Base component that works with any data provider
 * - StaticProjects.tsx: Component for static JSON data
 * - ApiProjects.tsx: Component for API data
 * - ProjectsExamples.tsx: Usage examples
 */

// Main component - now uses the new architecture
export { default } from './Projects';

// Alternative components for different use cases
export { default as Projects } from './Projects';

// Models and configuration
export * from './models';

// Hooks (for external use if needed)
export {
  useApiData,
  useConfig,
  useSearch,
  useScrollRefs,
  useUrlFilter
} from './hooks';

// Components (for external use if needed)
export {
  FilterButton,
  SearchBox,
  ProjectHeader,
  ProjectStats
} from './components';

// Utils (for external use if needed)
export { calculateCategoryResults, calculateTechnologyResults } from './utils';

export * from './constants';
