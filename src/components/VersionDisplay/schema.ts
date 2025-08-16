/**
 * VersionDisplay Component Schema
 *
 * Validation schema for version configuration data
 */

import { z } from 'zod';

export const VersionConfigSchema = z.object({
  version: z.string().optional(),
  href: z.string().url().optional(),
  prefix: z.string().optional(),
  badge: z.boolean().optional(),
  className: z.string().optional(),
  title: z.string().optional()
});

// Export the schema with a consistent name for registration
export const componentSchema = VersionConfigSchema;
export const schemaKey = 'version';
