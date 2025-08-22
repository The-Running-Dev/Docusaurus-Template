import React from 'react';
import Link from '@docusaurus/Link';
// import { useLocation } from '@docusaurus/router';

import { useFeaturesConfig } from '../../config/FeaturesConfig';

const PortfolioPageLinkNavbarItem: React.FC = () => {
  const featuresConfig = useFeaturesConfig();
  const { pathname } =
    typeof window !== 'undefined'
      ? { pathname: window.location.pathname }
      : { pathname: '/' };

  // Don't render if Portfolio page is disabled
  if (!featuresConfig.portfolioPage) {
    return null;
  }

  // Don't render if Portfolio is being used as the index page
  if (featuresConfig.portfolioPageAsIndex) {
    return null;
  }

  const isActive =
    pathname === '/portfolio' || pathname.startsWith('/portfolio/');

  return (
    <Link
      to="/portfolio"
      className={`navbar__item navbar__link ${
        isActive ? 'navbar__link--active' : ''
      }`}
    >
      Portfolio
    </Link>
  );
};

export default PortfolioPageLinkNavbarItem;
