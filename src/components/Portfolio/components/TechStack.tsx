import { type ReactNode } from 'react';
import Section from './Section';
import CardGrid from './CardGrid';
import TechCard from './TechCard';
import ProjectsLink from './ProjectsLink';
import Tooltip from '../../Tooltip';

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
  return (
    <Section title="Technologies & Skills" className="techStack">
      <CardGrid className="techGrid">
        {technologies.map((tech, idx: number) => {
          const techCardContent = <TechCard tech={tech} />;

          const techCard = (
            <ProjectsLink
              configuredLink={tech.link}
              filter={`tag-${tech.name.toLowerCase()}`}
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
