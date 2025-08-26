import { type ReactNode } from 'react';

import Section from './Section';
import CardGrid from './CardGrid';
import CategoryCard from './CategoryCard';
import ProjectsLink from './ProjectsLink';
import { ProjectCategory } from '../models';

interface CategoriesProps {
  categories: ProjectCategory[];
}

export default function Categories({ categories }: CategoriesProps): ReactNode {
  return (
    <Section title="Categories" className="projectShowcase">
      <CardGrid>
        {categories.map((category: ProjectCategory, idx: number) => (
          <ProjectsLink
            key={idx}
            configuredLink=""
            filter={`category-${category.category.toLowerCase()}`}
            className="projectCard"
          >
            <CategoryCard category={category} />
          </ProjectsLink>
        ))}
      </CardGrid>
    </Section>
  );
}
