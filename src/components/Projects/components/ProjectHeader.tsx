import clsx from 'clsx';
import Heading from '@theme/Heading';
import { ProjectHeaderProps } from '../models';

/**
 * ProjectHeader component
 * Displays the main header section for the projects page
 */
export function ProjectHeader({ categoryText }: ProjectHeaderProps) {
  return (
    <header className={clsx('hero hero--primary', 'heroBanner')}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Projects
        </Heading>
        <p className="heroSubtitle">
          Explore my {categoryText.toLowerCase()} development projects across
          multiple technologies
        </p>
      </div>
    </header>
  );
}
