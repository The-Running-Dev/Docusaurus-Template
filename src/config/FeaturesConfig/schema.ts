/**
 * Features Configuration Schema
 *
 * Validation schema for feature flags configuration data
 */

import { z } from 'zod';

export const FeaturesConfigSchema = z.object({
  giscusComments: z.boolean(),
  gitHubLinks: z.boolean(),
  navBarLinks: z.boolean(),
  themeSwitcher: z.boolean(),
  textSizeSwitcher: z.boolean(),
  readerMode: z.boolean(),
  versionDisplay: z.boolean(),
  cvPage: z.boolean(),
  portfolioPage: z.boolean(),
  projectsPage: z.boolean(),
  portfolioPageAsIndex: z.boolean(),
  dataCaching: z.boolean()
});

// Export the schema with a consistent name for registration
export const componentSchema = FeaturesConfigSchema;
export const schemaKey = 'Features';
