import React from 'react';
import Link from '@docusaurus/Link';
// import { useLocation } from '@docusaurus/router';

import { useFeaturesConfig } from '../../config/FeaturesConfig';

const ProjectsPageLinkNavbarItem: React.FC = () => {
  const featuresConfig = useFeaturesConfig();
  const { pathname } =
    typeof window !== 'undefined'
      ? { pathname: window.location.pathname }
      : { pathname: '/' };

  // Don't render if Projects page is disabled
  if (!featuresConfig.projectsPage) {
    return null;
  }

  const isActive =
    pathname === '/projects' || pathname.startsWith('/projects/');

  return (
    <Link
      to="/projects"
      className={`navbar__item navbar__link ${
        isActive ? 'navbar__link--active' : ''
      }`}
    >
      Projects
    </Link>
  );
};

export default ProjectsPageLinkNavbarItem;
