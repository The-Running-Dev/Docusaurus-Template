/**
 * NavBarLinks Component Schema
 *
 * Validation schema for navbar links configuration data
 */

import { z } from 'zod';

export const NavbarLinkSchema = z.object({
  href: z.string(),
  label: z.string(),
  position: z.string().optional(),
  ariaLabel: z.string().optional()
});

export const NavbarLinksSchema = z.object({
  links: z.array(NavbarLinkSchema)
});

// Export the schema with a consistent name for registration
export const componentSchema = NavbarLinksSchema;
export const schemaKey = 'navbarLinks';
