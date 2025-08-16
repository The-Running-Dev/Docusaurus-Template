/**
 * Badges Component Schema
 *
 * Validation schema for badge configuration data
 */

import { z } from 'zod';

export const BadgeSchema = z.object({
  name: z.string(),
  url: z.string(),
  link: z.string()
});

export const BadgeCategorySchema = z.object({
  key: z.string(),
  title: z.string(),
  icon: z.string(),
  badges: z.array(BadgeSchema)
});

export const BadgeConfigSchema = z.object({
  templateVariables: z.record(z.string(), z.string()),
  badgeCategories: z.array(BadgeCategorySchema)
});

// Export the schema with a consistent name for registration
export const componentSchema = BadgeConfigSchema;
export const schemaKey = 'badgeConfig';
