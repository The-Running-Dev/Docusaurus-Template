import React from 'react';
import Giscus from '@giscus/react';
import { useColorMode } from '@docusaurus/theme-common';

import FeatureComponent from '../FeatureComponent';
import { Features } from '../../config/FeaturesConfig';

// @ts-ignore
import { giscus as configData } from '../../../data';

/**
 * GiscusComments Component
 *
 * Integrates Giscus comments into the site.
 *
 * Features:
 * - Lazy loading for performance
 * - Configurable via JSON file
 * - Supports dark/light themes based on Docusaurus color mode
 * - Handles missing configuration gracefully
 */
const GiscusComments: React.FC = () => {
  return (
    <FeatureComponent feature={Features.GiscusComments} configData={configData}>
      {(config) => {
        const { colorMode } = useColorMode();

        // Check if configuration is available
        if (
          !config.repo ||
          !config.repoId ||
          !config.category ||
          !config.categoryId
        ) {
          return (
            <div
              style={{ padding: '20px', textAlign: 'center', color: '#666' }}
            >
              <p>💬 Comments are not configured yet.</p>
              <p>
                Configure Giscus settings in{' '}
                <code>src/config/giscus-config.ts</code> to enable comments.
              </p>
              <p>
                <a
                  href="https://giscus.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0969da' }}
                >
                  Configure Giscus →
                </a>
              </p>
            </div>
          );
        }

        return (
          <Giscus
            id="comments"
            repo={config.repo as `${string}/${string}`}
            repoId={config.repoId}
            category={config.category}
            categoryId={config.categoryId}
            mapping={
              config.mapping as
                | 'pathname'
                | 'url'
                | 'title'
                | 'og:title'
                | 'specific'
                | 'number'
            }
            term={config.term}
            reactionsEnabled={config.reactionsEnabled ? '1' : '0'}
            emitMetadata={config.emitMetadata ? '1' : '0'}
            inputPosition={config.inputPosition as 'top' | 'bottom'}
            theme={colorMode === 'dark' ? 'dark' : 'light'}
            lang={config.lang}
            loading="lazy"
          />
        );
      }}
    </FeatureComponent>
  );
};

export default GiscusComments;
