/**
 * Global Schema Registry
 *
 * Central registration system for all component schemas.
 * This module automatically imports and registers schemas from all components.
 */

import { z } from 'zod';

// Import all component schemas
import * as themesSchema from '../components/ThemeSwitcher/schema';
import * as navbarLinksSchema from '../components/NavBarLinks/schema';
import * as badgesSchema from '../components/Badges/schema';
import * as githubSchema from '../components/GitHubInfo/schema';
import * as versionSchema from '../components/VersionDisplay/schema';
import * as projectsSchema from '../components/Projects/schema';
import * as featuresSchema from '../config/FeaturesConfig/schema';

// Schema registry
const schemaRegistry: Record<string, z.ZodSchema> = {};

// Auto-register all imported schemas
const schemaModules = [
  themesSchema,
  navbarLinksSchema,
  badgesSchema,
  githubSchema,
  versionSchema,
  projectsSchema,
  featuresSchema
];

// Register all schemas
schemaModules.forEach((module) => {
  if (module.componentSchema && module.schemaKey) {
    registerSchema(module.schemaKey, module.componentSchema);
  }
});

/**
 * Register a schema with a specific key
 * @param key - The key to register the schema under
 * @param schema - The Zod schema to register
 */
export function registerSchema(key: string, schema: z.ZodSchema): void {
  schemaRegistry[key] = schema;
}

/**
 * Get a registered schema by key
 * @param key - The schema key to retrieve
 * @returns The registered schema or undefined
 */
export function getSchema(key: string): z.ZodSchema | undefined {
  return schemaRegistry[key];
}

/**
 * Get all registered schema keys
 * @returns Array of all registered schema keys
 */
export function getRegisteredKeys(): string[] {
  return Object.keys(schemaRegistry);
}

/**
 * Validate data with the appropriate schema
 * @param key - The schema key to use for validation
 * @param data - The data to validate
 * @returns The validated data
 * @throws Error if validation fails or schema not found
 */
export function validateData<T = any>(key: string, data: any): T {
  const schema = schemaRegistry[key];

  if (!schema) {
    // If no schema is registered, return data as-is with warning
    console.warn(
      `No Schema Found for Key: ${key}. Available keys: ${getRegisteredKeys().join(', ')}`
    );
    return data as T;
  }

  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation Failed for Key "${key}": ${error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`
      );
    }
    throw error;
  }
}

/**
 * Check if a schema is registered for a given key
 * @param key - The schema key to check
 * @returns True if schema is registered, false otherwise
 */
export function hasSchema(key: string): boolean {
  return key in schemaRegistry;
}

/**
 * Remove a schema from the registry
 * @param key - The schema key to remove
 * @returns True if schema was removed, false if it didn't exist
 */
export function unregisterSchema(key: string): boolean {
  if (key in schemaRegistry) {
    delete schemaRegistry[key];
    return true;
  }
  return false;
}

// Export registry for debugging/inspection (read-only)
export function getSchemaRegistry(): Readonly<Record<string, z.ZodSchema>> {
  return Object.freeze({ ...schemaRegistry });
}
