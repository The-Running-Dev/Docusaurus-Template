import React from 'react';
import Link from '@docusaurus/Link';

import { useFeaturesConfig } from '../../config/FeaturesConfig';

const ProjectsPageLinkNavbarItem: React.FC = () => {
  const featuresConfig = useFeaturesConfig();

  // Don't render if Projects page is disabled
  if (!featuresConfig.projectsPage) {
    return null;
  }

  return (
    <Link
      to="/projects"
      className="navbar__item navbar__link"
      activeClassName="navbar__link--active"
    >
      Projects
    </Link>
  );
};

export default ProjectsPageLinkNavbarItem;
