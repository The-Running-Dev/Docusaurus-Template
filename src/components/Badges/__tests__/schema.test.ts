import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  BadgeSchema,
  BadgeCategorySchema,
  BadgeConfigSchema
} from '../schema';

describe('Badges schema', () => {
  it('validates a single badge', () => {
    const badge = { name: 'Build', url: 'https://img', link: 'https://link' };
    expect(() => BadgeSchema.parse(badge)).not.toThrow();
  });

  it('rejects badge with missing fields', () => {
    const invalid = { name: 'X', url: 'y' } as any;
    expect(() => BadgeSchema.parse(invalid)).toThrow(z.ZodError);
  });

  it('validates a badge category', () => {
    const cat = {
      key: 'ci',
      title: 'CI',
      icon: 'faCogs',
      badges: [
        { name: 'Build', url: 'https://img', link: 'https://link' }
      ]
    };
    expect(() => BadgeCategorySchema.parse(cat)).not.toThrow();
  });

  it('rejects category without badges array', () => {
    const invalid = { key: 'x', title: 'X', icon: 'faCogs' } as any;
    expect(() => BadgeCategorySchema.parse(invalid)).toThrow(z.ZodError);
  });

  it('validates full badge config', () => {
    const cfg = {
      templateVariables: { user: 'u', repository: 'r' },
      badgeCategories: [
        {
          key: 'ci',
          title: 'CI',
          icon: 'faCogs',
          badges: [
            { name: 'Build', url: 'https://img', link: 'https://link' }
          ]
        }
      ]
    };
    expect(() => BadgeConfigSchema.parse(cfg)).not.toThrow();
  });

  it('rejects config missing templateVariables', () => {
    const invalid = { badgeCategories: [] } as any;
    expect(() => BadgeConfigSchema.parse(invalid)).toThrow(z.ZodError);
  });
});

