/**
 * Models for Projects component
 */

import React from 'react';
// UI-specific types below
export interface FilterButtonProps {
  option: { key: string; label: string; category?: string; count?: number };
  isSelected: boolean;
  isDisabled: boolean;
  isLoading?: boolean;
  hasSearchResults?: boolean;
  searchResultCount?: number;
  totalCount?: number;
  onClick: (key: string) => void;
  searchTerm?: string;
}

export interface SearchBoxProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  handleClearSearch: () => void;
}

export interface ProjectHeaderProps {
  categoryText: string;
}

export interface ProjectStatsProps {
  stats: {
    totalProjects: number;
    recentProjects: number;
    totalTechnologies: number;
    averageAge: string;
  };
}
