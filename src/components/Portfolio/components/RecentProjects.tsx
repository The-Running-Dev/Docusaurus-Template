import { type ReactNode } from 'react';

import Section from './Section';
import CardGrid from './CardGrid';
import ProjectCard from './ProjectCard';
import ProjectsLink from './ProjectsLink';
import { Project } from '../../../../shared/types/project-types';

interface RecentProjectsProps {
  projects: Project[];
}

export default function RecentProjects({
  projects
}: RecentProjectsProps): ReactNode {
  if (projects.length === 0) {
    return null;
  }

  const renderProjectTags = (tags: string[]) => {
    return tags.map((tag: string, tagIdx: number) => {
      const normalizedTagKey = `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`;

      return (
        <ProjectsLink
          key={tagIdx}
          configuredLink=""
          filter={normalizedTagKey}
          className="portfolioProjectTag"
        >
          {tag}
        </ProjectsLink>
      );
    });
  };

  return (
    <Section
      title="Recent Projects"
      titleLevel="h3"
      titleStyle={{ marginTop: '2rem', fontSize: '1.5rem' }}
    >
      <CardGrid>
        {projects.slice(0, 3).map((project, idx) => (
          <ProjectCard
            key={`cross-${idx}`}
            project={project}
            style={{ opacity: 0.8 }}
            renderTags={renderProjectTags}
          />
        ))}
      </CardGrid>
    </Section>
  );
}
