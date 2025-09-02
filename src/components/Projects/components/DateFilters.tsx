import React from 'react';
import { FilterOption } from '../../../../shared/types/project-types';

export interface DateFiltersProps {
  dateOptions: FilterOption[];
  selectedDateRange: string;
  onDateChange: (range: string) => void;
  searchTerm: string;
}

export function DateFilters({
  dateOptions,
  selectedDateRange,
  onDateChange,
  searchTerm
}: DateFiltersProps): React.ReactElement {
  return (
    <div className="filterGroup">
      <div className="filterButtons">
        {dateOptions.map((option) => (
          <button
            key={option.key}
            onClick={searchTerm ? undefined : () => onDateChange(option.key)}
            disabled={!!searchTerm}
            className={`filterButton ${
              searchTerm
                ? 'disabled'
                : selectedDateRange === option.key
                  ? 'active'
                  : ''
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
