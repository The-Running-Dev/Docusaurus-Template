import { useEffect, useMemo } from 'react';
import { DataLoader } from '../services/dataLoader';
import {
  Features,
  useFeaturesConfig,
  FeatureToConfigMap
} from '../config/FeaturesConfig';
import { DEFAULT_PORTFOLIO_DATA } from '../components/Portfolio/constants';
import { DEFAULT_PROJECTS_DATA } from '../components/Projects/constants';

const data = [
  {
    key: 'portfolio',
    feature: Features.PortfolioPage,
    defaultData: DEFAULT_PORTFOLIO_DATA
  },
  {
    key: 'projects',
    feature: Features.ProjectsPage,
    defaultData: DEFAULT_PROJECTS_DATA
  }
];

export function useAppInitialization() {
  const features = useFeaturesConfig();
  const dataLoader = useMemo(() => new DataLoader(), []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Filter data array to only load enabled features
        const enabledDataSources = data.filter((item) => {
          const featureKey = FeatureToConfigMap[item.feature];

          return features[featureKey];
        });

        // Load only enabled features' data in parallel
        await dataLoader.loadMultipleData(enabledDataSources);
      } catch (error) {
        console.error('Failed to Initialize App Data:', error);
      }
    };

    initializeData();
  }, [dataLoader, features]);

  return {
    dataLoader
  };
}
