import { type ReactNode } from 'react';

import Section from './Section';
import CardGrid from './CardGrid';
import TechCard from './TechCard';
import ProjectsLink from './ProjectsLink';
import Tooltip from '../../Tooltip';
import { useTechnologyMapping } from '../hooks/useTechnologyMapping';

interface TechItem {
  name: string;
  category: string;
  link?: string;
  subCategories?: string[];
}

interface TechStackProps {
  technologies: TechItem[];
}

export default function TechStack({
  technologies
}: TechStackProps): ReactNode {
  const { getFilterKey } = useTechnologyMapping();

  return (
    <Section title="Technologies & Skills" className="techStack">
      <CardGrid className="techGrid">
        {technologies.map((tech, idx: number) => {
          const techCardContent = <TechCard tech={tech} />;
          const filterKey = getFilterKey(tech.name, tech.category);

          const techCard = (
            <ProjectsLink
              configuredLink={tech.link}
              filter={filterKey}
            >
              {techCardContent}
            </ProjectsLink>
          );

          if (tech.subCategories && tech.subCategories.length > 0) {
            return (
              <Tooltip
                key={idx}
                title={tech.name}
                items={tech.subCategories}
                position="auto"
              >
                {techCard}
              </Tooltip>
            );
          }

          return techCard;
        })}
      </CardGrid>
    </Section>
  );
}
