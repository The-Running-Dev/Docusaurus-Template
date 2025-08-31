import { describe, it, expect } from 'vitest';
import { componentSchema, BadgeConfigSchema, schemaKey } from '../schema';
import { DEFAULT_BADGES_DATA } from '../constants';

describe('Badges constants and schema integration', () => {
  it('exports a stable schema key', () => {
    expect(schemaKey).toBe('badgeConfig');
  });

  it('componentSchema equals BadgeConfigSchema', () => {
    expect(componentSchema).toBe(BadgeConfigSchema);
  });

  it('DEFAULT_BADGES_DATA conforms to schema (real data import)', () => {
    const parsed = componentSchema.parse(DEFAULT_BADGES_DATA);
    expect(parsed.badgeCategories.length).toBeGreaterThan(0);
  });

  it('DEFAULT_BADGES_DATA includes expected template variables', () => {
    const { templateVariables } = DEFAULT_BADGES_DATA as any;
    expect(typeof templateVariables.user).toBe('string');
    expect(typeof templateVariables.repository).toBe('string');
  });
});

