import { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { useProjectFiltering } from '../hooks/useProjectFiltering';

interface ProjectsLinkProps {
  configuredLink?: string;
  filter: string;
  className?: string;
  children: ReactNode;
}

export default function ProjectsLink({
  configuredLink,
  filter,
  className,
  children
}: ProjectsLinkProps): ReactNode {
  const { shouldCreateLink, getFilterLink } = useProjectFiltering();

  if (!shouldCreateLink(configuredLink, filter)) {
    return <div className={className}>{children}</div>;
  }

  const link = getFilterLink(configuredLink, filter);

  return (
    <Link to={link} className={className}>
      {children}
    </Link>
  );
}