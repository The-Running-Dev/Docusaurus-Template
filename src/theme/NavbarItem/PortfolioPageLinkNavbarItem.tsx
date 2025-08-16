import React from 'react';
import Link from '@docusaurus/Link';

import { useFeaturesConfig } from '../../config/FeaturesConfig';

const PortfolioPageLinkNavbarItem: React.FC = () => {
  const featuresConfig = useFeaturesConfig();

  // Don't render if Portfolio page is disabled
  if (!featuresConfig.portfolioPage) {
    return null;
  }

  // Don't render if Portfolio is being used as the index page
  if (featuresConfig.portfolioPageAsIndex) {
    return null;
  }

  return (
    <Link
      to="/portfolio"
      className="navbar__item navbar__link"
      activeClassName="navbar__link--active"
    >
      Portfolio
    </Link>
  );
};

export default PortfolioPageLinkNavbarItem;
