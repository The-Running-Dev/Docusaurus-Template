import { FilterButtonProps } from '../models';

/**
 * Reusable FilterButton component
 * Handles consistent filter button behavior across categories, technologies, and tags
 */
export function FilterButton({
  option,
  isSelected,
  isDisabled,
  isLoading = false,
  hasSearchResults = false,
  searchResultCount = 0,
  totalCount = 0,
  onClick,
  searchTerm
}: FilterButtonProps) {
  const getDisplayLabel = () => {
    if (searchTerm && hasSearchResults && searchResultCount > 0) {
      return `${option.label.replace(/\s*\(\d+\)$/, '')} (${searchResultCount} of ${totalCount})`;
    }
    return option.label;
  };

  const getButtonClass = () => {
    let classes = [];

    if (isLoading) {
      classes.push('loading');
    }

    if (searchTerm) {
      classes.push(hasSearchResults ? 'active disabled' : 'disabled');
    } else {
      if (isSelected) classes.push('active');
    }

    return classes.join(' ');
  };

  return (
    <button
      key={option.key}
      onClick={searchTerm ? undefined : () => onClick(option.key)}
      disabled={isDisabled}
      className={`filterButton ${getButtonClass()}`}
      data-category={option.category || ''}
    >
      {getDisplayLabel()}
    </button>
  );
}
