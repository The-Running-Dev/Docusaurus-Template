import React from 'react';
import Link from '@docusaurus/Link';

import { useFeaturesConfig } from '../../config/FeaturesConfig';

const CVPageLinkNavbarItem: React.FC = () => {
  const featuresConfig = useFeaturesConfig();

  // Don't render if CV page is disabled
  if (!featuresConfig.cvPage) {
    return null;
  }

  return (
    <Link
      to="/cv"
      className="navbar__item navbar__link"
      activeClassName="navbar__link--active"
    >
      CV/Resume
    </Link>
  );
};

export default CVPageLinkNavbarItem;
