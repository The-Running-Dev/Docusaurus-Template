import { ConfigurationManager } from './configurationManager';
import type {
  FeatureFlag,
  FeatureFlagState,
  ConfigValue,
  ConfigurationSchema
} from '../types/configuration';
import type { FeaturesConfig } from '../config/FeaturesConfig/models';

/**
 * Feature Flag Manager
 * Extends configuration management with feature flag capabilities
 * Integrates with existing FeaturesConfig
 */
export class FeatureFlagManager {
  private readonly configManager: ConfigurationManager;
  private readonly evaluationContext: Map<string, ConfigValue> = new Map();

  constructor(configManager: ConfigurationManager) {
    this.configManager = configManager;
  }

  /**
   * Initialize feature flags from existing FeaturesConfig
   */
  async initializeFromFeaturesConfig(
    featuresConfig: FeaturesConfig
  ): Promise<void> {
    const featureSchemas: ConfigurationSchema<boolean>[] = [
      {
        key: 'feature.giscus-comments',
        defaultValue: featuresConfig.giscusComments,
        type: 'boolean',
        description: 'Enable Giscus comments on pages',
        category: 'features'
      },
      {
        key: 'feature.github-links',
        defaultValue: featuresConfig.gitHubLinks,
        type: 'boolean',
        description: 'Show GitHub links in navbar',
        category: 'features'
      },
      {
        key: 'feature.theme-switcher',
        defaultValue: featuresConfig.themeSwitcher,
        type: 'boolean',
        description: 'Show theme switcher in navbar',
        category: 'features'
      },
      {
        key: 'feature.text-size-switcher',
        defaultValue: featuresConfig.textSizeSwitcher,
        type: 'boolean',
        description: 'Show text size switcher in navbar',
        category: 'features'
      },
      {
        key: 'feature.reader-mode',
        defaultValue: featuresConfig.readerMode,
        type: 'boolean',
        description: 'Show reader mode toggle in navbar',
        category: 'features'
      },
      {
        key: 'feature.version-display',
        defaultValue: featuresConfig.versionDisplay,
        type: 'boolean',
        description: 'Show version display in navbar',
        category: 'features'
      },
      {
        key: 'feature.cv-page',
        defaultValue: featuresConfig.cvPage,
        type: 'boolean',
        description: 'Show CV page in navbar',
        category: 'features'
      },
      {
        key: 'feature.portfolio-page',
        defaultValue: featuresConfig.portfolioPage,
        type: 'boolean',
        description: 'Show Portfolio page in navbar',
        category: 'features'
      },
      {
        key: 'feature.projects-page',
        defaultValue: featuresConfig.projectsPage,
        type: 'boolean',
        description: 'Show Projects page in navbar',
        category: 'features'
      },
      {
        key: 'feature.portfolio-as-index',
        defaultValue: featuresConfig.portfolioPageAsIndex,
        type: 'boolean',
        description: 'Use Portfolio page as index instead of welcome page',
        category: 'features'
      }
    ];

    // Register all feature schemas
    for (const schema of featureSchemas) {
      await this.configManager.registerSchema(schema);
    }
  }

  /**
   * Define a new feature flag
   */
  async defineFlag(
    key: string,
    defaultEnabled: boolean,
    options: Partial<FeatureFlag> = {}
  ): Promise<void> {
    const schema: ConfigurationSchema<FeatureFlag> = {
      key: `flag.${key}`,
      defaultValue: {
        key,
        enabled: defaultEnabled,
        description: options.description,
        rolloutPercentage: options.rolloutPercentage || 100,
        conditions: options.conditions || {}
      },
      type: 'object',
      description: options.description,
      category: 'feature-flags'
    };

    await this.configManager.registerSchema(schema);
  }

  /**
   * Check if a feature is enabled
   * Supports both legacy feature config keys and new flag keys
   */
  async isFeatureEnabled(key: string): Promise<boolean> {
    // Check for legacy feature config format first
    const legacyKey = `feature.${key.replace(/^feature\./, '')}`;
    const legacyValue = await this.configManager.getValue<boolean>(legacyKey);

    if (legacyValue !== null) {
      return legacyValue;
    }

    // Check for new feature flag format
    const flagKey = `flag.${key.replace(/^flag\./, '')}`;
    const flag = await this.configManager.getValue<FeatureFlag>(flagKey);

    if (!flag) {
      return false;
    }

    return this.evaluateFlag(flag);
  }

  /**
   * Enable/disable a feature
   */
  async setFeatureEnabled(key: string, enabled: boolean): Promise<boolean> {
    // Try legacy format first
    const legacyKey = `feature.${key.replace(/^feature\./, '')}`;
    const legacyExists =
      (await this.configManager.getValue<boolean>(legacyKey)) !== null;

    if (legacyExists) {
      return await this.configManager.setValue(legacyKey, enabled);
    }

    // Handle flag format
    const flagKey = `flag.${key.replace(/^flag\./, '')}`;
    const flag = await this.configManager.getValue<FeatureFlag>(flagKey);

    if (flag) {
      const updatedFlag: FeatureFlag = { ...flag, enabled };
      return await this.configManager.setValue(flagKey, updatedFlag);
    }

    return false;
  }

  /**
   * Get current feature flags state
   */
  async getFeatureFlagsState(): Promise<FeatureFlagState> {
    const allValues = await this.configManager.getAllValues();
    const flags: Record<string, FeatureFlag> = {};

    // Extract feature flags and convert legacy features
    for (const [key, value] of Object.entries(allValues)) {
      if (
        key.startsWith('flag.') &&
        typeof value === 'object' &&
        value !== null
      ) {
        const flagKey = key.replace('flag.', '');
        flags[flagKey] = value as FeatureFlag;
      } else if (key.startsWith('feature.') && typeof value === 'boolean') {
        const flagKey = key.replace('feature.', '');
        flags[flagKey] = {
          key: flagKey,
          enabled: value,
          description: `Legacy feature flag: ${flagKey}`
        };
      }
    }

    return {
      flags,
      evaluationContext: Object.fromEntries(this.evaluationContext)
    };
  }

  /**
   * Set evaluation context for conditional flags
   */
  setEvaluationContext(key: string, value: ConfigValue): void {
    this.evaluationContext.set(key, value);
  }

  /**
   * Subscribe to feature flag changes
   */
  subscribeToFeature(
    key: string,
    callback: (enabled: boolean, flag?: FeatureFlag) => void
  ): () => void {
    // Subscribe to both legacy and new formats
    const legacyKey = `feature.${key.replace(/^feature\./, '')}`;
    const flagKey = `flag.${key.replace(/^flag\./, '')}`;

    const unsubscribeLegacy = this.configManager.subscribe(
      legacyKey,
      (event) => {
        if (typeof event.newValue === 'boolean') {
          callback(event.newValue);
        }
      }
    );

    const unsubscribeFlag = this.configManager.subscribe(flagKey, (event) => {
      if (typeof event.newValue === 'object' && event.newValue !== null) {
        const flag = event.newValue as FeatureFlag;
        callback(this.evaluateFlag(flag), flag);
      }
    });

    // Return combined unsubscribe function
    return () => {
      unsubscribeLegacy();
      unsubscribeFlag();
    };
  }

  // Private methods

  private evaluateFlag(flag: FeatureFlag): boolean {
    if (!flag.enabled) {
      return false;
    }

    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      const hash = this.hashString(flag.key);
      const userPercentile = hash % 100;
      if (userPercentile >= flag.rolloutPercentage) {
        return false;
      }
    }

    // Evaluate conditions
    if (flag.conditions && Object.keys(flag.conditions).length > 0) {
      for (const [conditionKey, expectedValue] of Object.entries(
        flag.conditions
      )) {
        const contextValue = this.evaluationContext.get(conditionKey);
        if (contextValue !== expectedValue) {
          return false;
        }
      }
    }

    return true;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}
