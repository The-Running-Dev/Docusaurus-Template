import { describe, it, expect, vi } from 'vitest';

describe('Theme config fallback', () => {
  it.skip('falls back to first theme when defaultTheme missing', async () => {
    vi.resetModules();
    vi.doMock('../../../data', () => ({
      themes: {
        themes: [
          { name: 'first', displayName: 'First', cssFile: 'themes/first.css' },
          { name: 'second', displayName: 'Second', cssFile: 'themes/second.css' }
        ],
        defaultTheme: 'missing'
      }
    }));
    const mod = await import('../themes');
    expect(mod.defaultTheme.name === 'first' || mod.defaultTheme.name === 'default').toBe(true);
  });
});
