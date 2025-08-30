import React from 'react';

import DataProvider from '../DataProvider';

import { Features } from '../../config/FeaturesConfig';
import { VersionConfig } from './models';
import { DEFAULT_VERSION_DATA } from './constants';

import './VersionDisplay.css';

/**
 * Version Display Component
 * Displays the current version of the application
 */
const VersionDisplay: React.FC = () => {
  // Get version from config or fallback to a default value
  const getDefaultVersion = (): string => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');

      return `${year}.${month}.${day}`;
    } catch {
      return '1.0.0';
    }
  };

  return (
    <DataProvider<VersionConfig>
      feature={Features.VersionDisplay}
      defaultData={DEFAULT_VERSION_DATA}
    >
      {(config, loading, error) => {
        if (loading) {
          return <span className="version-display">Loading...</span>;
        }

        if (error) {
          return <span className="version-display">v1.0.0</span>;
        }

        // Ensure config is not null/undefined
        if (!config) {
          return (
            <span className="version-display">v{getDefaultVersion()}</span>
          );
        }
        const version = config.version || getDefaultVersion();
        const prefix = config.prefix || 'v';
        const displayText = `${prefix}${version}`;
        const className =
          `version-display ${config.badge ? 'version-display--badge' : ''} ${
            config.className || ''
          }`.trim();

        // Render as link if href is provided
        if (config.href) {
          return (
            <a
              href={config.href}
              className={className}
              title={config.title || `Version ${version}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {displayText}
            </a>
          );
        }

        // Render as span if no href
        return (
          <span
            className={className}
            title={config.title || `Version ${version}`}
          >
            {displayText}
          </span>
        );
      }}
    </DataProvider>
  );
};

export default VersionDisplay;
