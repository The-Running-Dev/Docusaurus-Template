import React from 'react';
import Link from '@docusaurus/Link';
// import { useLocation } from '@docusaurus/router';

import { useFeaturesConfig } from '../../config/FeaturesConfig';

const CVPageLinkNavbarItem: React.FC = () => {
  const featuresConfig = useFeaturesConfig();
  const { pathname } =
    typeof window !== 'undefined'
      ? { pathname: window.location.pathname }
      : { pathname: '/' };

  // Don't render if CV page is disabled
  if (!featuresConfig.cvPage) {
    return null;
  }

  const isActive = pathname === '/cv' || pathname.startsWith('/cv/');

  return (
    <Link
      to="/cv"
      className={`navbar__item navbar__link ${
        isActive ? 'navbar__link--active' : ''
      }`}
    >
      CV/Resume
    </Link>
  );
};

export default CVPageLinkNavbarItem;
