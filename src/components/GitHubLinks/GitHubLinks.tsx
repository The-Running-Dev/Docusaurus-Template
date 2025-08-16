import React from 'react';

import FeatureComponent from '../FeatureComponent';
import { Features } from '../../config/FeaturesConfig';
import NavBarLinks from '../NavBarLinks';

// @ts-ignore
import { gitHubLinks as configData } from '../../../data';

/**
 * GitHubLinks Component
 *
 * A simple wrapper that loads GitHub-specific configuration and passes it to NavBarLinks.
 * Since GitHubLink and CustomNavBarLink interfaces are identical, no transformation is needed.
 *
 * Features:
 * - Direct config pass-through (no unnecessary transformation)
 * - Automatic icon resolution handled by NavBarLinks
 * - Consistent styling and behavior with other navbar components
 * - Delegates enabled/disabled logic to NavBarLinks
 */
const GitHubLinks: React.FC = () => {
  return (
    <FeatureComponent feature={Features.GitHubLinks} configData={configData}>
      {(gitHubConfig) => <NavBarLinks config={gitHubConfig} enabled={true} />}
    </FeatureComponent>
  );
};

export default GitHubLinks;
