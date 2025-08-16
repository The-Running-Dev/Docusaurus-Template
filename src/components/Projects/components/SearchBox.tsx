import { SearchBoxProps } from '../models';

/**
 * SearchBox component for project filtering
 * Includes search input field and clear button functionality
 */
export function SearchBox({
  searchTerm,
  setSearchTerm,
  searchInputRef,
  handleClearSearch
}: SearchBoxProps) {
  return (
    <div className="searchBox">
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchInput"
      />
      {searchTerm && (
        <button
          onClick={handleClearSearch}
          className="clearButton"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
