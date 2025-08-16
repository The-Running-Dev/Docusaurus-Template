import type { ConfigurationStorage } from '../types/configuration';

/**
 * LocalStorage-based Configuration Storage
 * Provides persistent storage using browser localStorage with async interface
 */
export class LocalStorageConfigurationStorage implements ConfigurationStorage {
  private readonly prefix: string;

  constructor(namespace: string = 'docusaurus-config') {
    this.prefix = `${namespace}:`;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(this.prefix + key);
    } catch (error) {
      console.warn(`Failed to get configuration item '${key}':`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(this.prefix + key, value);
    } catch (error) {
      console.error(`Failed to set configuration item '${key}':`, error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error(`Failed to remove configuration item '${key}':`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(this.prefix)
      );

      keys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear configuration storage:', error);
      throw error;
    }
  }
}

/**
 * Memory-only Configuration Storage
 * For testing or when persistence is not needed
 */
export class MemoryConfigurationStorage implements ConfigurationStorage {
  private store: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}
