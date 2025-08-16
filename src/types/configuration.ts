/**
 * Configuration Management Types
 * Provides type-safe configuration access with runtime validation
 */

// Supported configuration value types
export type ConfigValue = string | number | boolean | object | null;

// Configuration change event
export interface ConfigurationChangeEvent<T = ConfigValue> {
  key: string;
  oldValue: T;
  newValue: T;
  timestamp: Date;
  source: 'user' | 'system' | 'external';
}

// Configuration validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Configuration validator function
export type ConfigValidator<T = ConfigValue> = (value: T) => ValidationResult;

// Configuration schema definition
export interface ConfigurationSchema<T = ConfigValue> {
  key: string;
  defaultValue: T;
  type: 'string' | 'number' | 'boolean' | 'object';
  required?: boolean;
  validator?: ConfigValidator<T>;
  description?: string;
  category?: string;
}

// Configuration subscription callback
export type ConfigurationSubscription<T = ConfigValue> = (
  event: ConfigurationChangeEvent<T>
) => void;

// Configuration storage interface
export interface ConfigurationStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Configuration manager options
export interface ConfigurationManagerOptions {
  storage?: ConfigurationStorage;
  enablePersistence?: boolean;
  enableLogging?: boolean;
  validationMode?: 'strict' | 'lenient';
  namespace?: string;
}

// Configuration state
export interface ConfigurationState {
  values: Record<string, ConfigValue>;
  schemas: Record<string, ConfigurationSchema<any>>;
  lastModified: Date;
  version: string;
}

// Feature flag specific types extending existing FeaturesConfig
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
  conditions?: Record<string, ConfigValue>;
}

export interface FeatureFlagState {
  flags: Record<string, FeatureFlag>;
  evaluationContext?: Record<string, ConfigValue>;
}
