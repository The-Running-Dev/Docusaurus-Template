import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { useProjectFiltering } from '../Portfolio/hooks/useProjectFiltering';
import { useTechnologyMapping } from '../Portfolio/hooks/useTechnologyMapping';

interface TechTagsProps {
  techString: string;
  className?: string;
}

/**
 * Component that renders a comma-separated list of technologies as clickable filter tags
 * Uses the same styling and functionality as the Projects filter system
 */
export default function TechTags({
  techString,
  className = 'cv-tech-tags'
}: TechTagsProps): ReactNode {
  const { shouldCreateLink, getFilterLink } = useProjectFiltering();
  const { getFilterKey } = useTechnologyMapping();

  // Parse the tech string into individual technologies
  const technologies = techString
    .split(',')
    .map((tech) => tech.trim())
    .filter((tech) => tech.length > 0);

  const renderTechTag = (tech: string, index: number) => {
    const filterKey = getFilterKey(tech, 'technology');
    const shouldLink = shouldCreateLink(undefined, filterKey);
    
    if (shouldLink) {
      const link = getFilterLink(undefined, filterKey);
      return (
        <Link
          key={index}
          to={link}
          className="cv-tech-tag"
          title={`View projects using ${tech}`}
        >
          {tech}
        </Link>
      );
    }

    // Render as non-clickable span for technologies without matching projects
    return (
      <span key={index} className="cv-tech-tag cv-tech-tag-inactive">
        {tech}
      </span>
    );
  };

  return (
    <div className={className}>
      {technologies.map(renderTechTag)}
    </div>
  );
}
