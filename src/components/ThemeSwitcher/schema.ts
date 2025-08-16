/**
 * ThemeSwitcher Component Schema
 *
 * Validation schema for theme configuration data
 */

import { z } from 'zod';

export const ThemeSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  cssFile: z.string()
});

export const ThemesConfigSchema = z.object({
  defaultTheme: z.string().optional(),
  themes: z.array(ThemeSchema)
});

// Export the schema with a consistent name for registration
export const componentSchema = ThemesConfigSchema;
export const schemaKey = 'themes';
