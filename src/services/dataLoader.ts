import { useDataStore } from '../store/dataStore';
import { Features, FeatureToConfigMap } from '../config/FeaturesConfig';
import { getData } from '../data';

// @ts-ignore
import { globalConfig as configData } from '../../data';

function getProviderType(source: string): 'json' | 'http' {
  if (source?.startsWith('http://') || source?.startsWith('https://')) {
    return 'http';
  }
  return 'json';
}

export class DataLoader {
  private store = useDataStore;

  /**
   * Load data for a specific key from configured source
   */
  async loadData(
    key: string,
    feature?: Features,
    defaultData?: any
  ): Promise<void> {
    this.store.getState().setLoading(key, true);
    this.store.getState().setError(key, null);

    try {
      // Check if there's a configured data source
      const dataConfig = this.getDataConfig(feature);

      let data: any;
      let source: string;

      if (dataConfig) {
        if (dataConfig.provider === 'http') {
          data = await this.fetchHttpData(dataConfig.source);
          source = dataConfig.source;
        } else {
          // For JSON/local files, we use the defaultData since it's already loaded
          data = defaultData;
          source = dataConfig.source;
        }
      } else {
        // Fallback to default data
        data = defaultData;
        source = 'static';
      }

      this.store.getState().setData(key, data, { source });
    } catch (error) {
      const loadError =
        error instanceof Error
          ? error
          : new Error('Unknown data loading error');

      this.store.getState().setError(key, loadError);
    } finally {
      this.store.getState().setLoading(key, false);
    }
  }

  /**
   * Load multiple data sources in parallel
   */
  async loadMultipleData(
    requests: Array<{
      key: string;
      feature?: Features;
      defaultData?: any;
    }>
  ): Promise<void> {
    await Promise.all(
      requests.map((request) =>
        this.loadData(request.key, request.feature, request.defaultData)
      )
    );
  }

  private getDataConfig(feature?: Features) {
    if (!feature) {
      return null;
    }

    try {
      const globalConfigData = getData(configData);
      const configKey = FeatureToConfigMap[feature];
      const featureConfig = globalConfigData[configKey];

      if (featureConfig?.source) {
        return {
          source: featureConfig.source,
          provider: getProviderType(featureConfig.source)
        };
      }
    } catch (error) {
      console.warn('Failed to load configuration, using default data:', error);
    }

    return null;
  }

  private async fetchHttpData(url: string): Promise<any> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const jsonData = await response.json();

    // Handle different API response formats
    if (jsonData.success && jsonData.data) {
      return jsonData.data;
    }

    if (Array.isArray(jsonData)) {
      return jsonData;
    }

    return jsonData;
  }
}
