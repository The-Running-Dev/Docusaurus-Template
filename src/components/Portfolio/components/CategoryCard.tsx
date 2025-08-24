import { type ReactNode } from 'react';
import Heading from '@theme/Heading';
import { ProjectCategory } from '../models';

interface CategoryCardProps {
  category: ProjectCategory;
  children?: ReactNode;
}

export default function CategoryCard({
  category,
  children
}: CategoryCardProps): ReactNode {
  return (
    <>
      <div className="projectIcon">{category.icon}</div>
      <Heading as="h3" className="projectTitle">
        {category.category}
      </Heading>
      <p className="projectDescription">{category.description}</p>
      {children}
    </>
  );
}
