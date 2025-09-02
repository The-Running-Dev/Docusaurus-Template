import { type ReactNode, useState, useEffect } from 'react';
import { FilterOption } from '../../../../shared/types/project-types';
import { TagTiers } from '../../../../shared/types/project-types';

interface TagFiltersProps {
  tagTiers: TagTiers;
  activeTag?: string;
  onTagChange: (tag: string) => void;
}

export default function TagFilters({
  tagTiers,
  activeTag,
  onTagChange
}: TagFiltersProps): ReactNode {
  const [showCommon, setShowCommon] = useState(false);
  const [showRare, setShowRare] = useState(false);
  const [userInteracted, setUserInteracted] = useState({
    common: false,
    rare: false
  });

  // Check if active tag is in hidden sections and auto-expand
  useEffect(() => {
    if (!activeTag) return;

    const isActiveInCommon = tagTiers.common.some(
      (tag) => tag.key === activeTag
    );
    const isActiveInRare = tagTiers.rare.some((tag) => tag.key === activeTag);

    // Auto-expand sections containing active tag (but don't override user preferences)
    if (isActiveInCommon && !userInteracted.common) {
      setShowCommon(true);
    }
    if (isActiveInRare && !userInteracted.rare) {
      setShowRare(true);
    }
  }, [activeTag, tagTiers, userInteracted]);

  const toggleCommon = () => {
    setShowCommon(!showCommon);
    setUserInteracted((prev) => ({ ...prev, common: true }));
  };

  const toggleRare = () => {
    setShowRare(!showRare);
    setUserInteracted((prev) => ({ ...prev, rare: true }));
  };

  const renderTagButton = (tag: FilterOption) => (
    <button
      key={tag.key}
      className={`filterButton ${activeTag === tag.key ? 'active' : ''}`}
      onClick={() => onTagChange(tag.key)}
    >
      {tag.label}
    </button>
  );

  const renderActiveTagsFromSection = (tags: FilterOption[]) => {
    return tags.filter((tag) => tag.key === activeTag).map(renderTagButton);
  };

  return (
    <div className="filterGroup tag-filters">
      <div className="filterButtons">
        <span className="filterGroupTitle">Tags:</span>

        {/* All Tags option */}
        {renderTagButton(tagTiers.allTagsOption)}

        {/* Popular tags (always visible) */}
        {tagTiers.popular.map(renderTagButton)}

        {/* Common tags section */}
        {tagTiers.common.length > 0 && (
          <>
            {!showCommon && (
              <>
                {renderActiveTagsFromSection(tagTiers.common)}
                <button
                  className="filterButton showMore tag-section-toggle"
                  onClick={toggleCommon}
                >
                  + {tagTiers.common.length} more common tags
                  <span
                    className="auto-expand-indicator"
                    title="This section auto-expands when filtering"
                  >
                    ⚡
                  </span>
                </button>
              </>
            )}

            {showCommon && (
              <>
                {tagTiers.common.map(renderTagButton)}
                <button
                  className="filterButton showMore tag-section-toggle"
                  onClick={toggleCommon}
                >
                  - Hide common tags
                </button>
              </>
            )}
          </>
        )}

        {/* Rare tags section */}
        {tagTiers.rare.length > 0 && (
          <>
            {!showRare && (
              <>
                {renderActiveTagsFromSection(tagTiers.rare)}
                <button
                  className="filterButton showMore tag-section-toggle"
                  onClick={toggleRare}
                >
                  + {tagTiers.rare.length} less common tags
                  <span
                    className="auto-expand-indicator"
                    title="This section auto-expands when filtering"
                  >
                    ⚡
                  </span>
                </button>
              </>
            )}

            {showRare && (
              <>
                {tagTiers.rare.map(renderTagButton)}
                <button
                  className="filterButton showMore tag-section-toggle"
                  onClick={toggleRare}
                >
                  - Hide less common tags
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
