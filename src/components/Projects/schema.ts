/**
 * Projects Component Schema
 *
 * Validation schema for projects configuration data
 */

import { z } from 'zod';

export const ProjectSchema = z.object({
  title: z.string(),
  summary: z.string(),
  lastModified: z.string().optional(),
  link: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const ProjectSubCategorySchema = z.object({
  name: z.string(),
  projects: z.array(ProjectSchema)
});

export const ProjectCategorySchema = z.object({
  category: z.string(),
  subCategories: z.array(ProjectSubCategorySchema)
});

export const ProjectConfigSchema = z.object({
  categories: z.array(ProjectCategorySchema)
});

// Export the schema with a consistent name for registration
export const componentSchema = ProjectConfigSchema;
export const schemaKey = 'projects';
