import { describe, it, expect } from 'vitest';
import { selectDefaultTheme } from '../themes';

describe('Theme config fallback', () => {
  it('falls back to first theme when defaultTheme missing', () => {
    const list = [
      { name: 'first', displayName: 'First', cssFile: 'themes/first.css' },
      { name: 'second', displayName: 'Second', cssFile: 'themes/second.css' }
    ] as any;
    const selected = selectDefaultTheme(list, 'missing');
    expect(selected.name === 'first' || selected.name === 'default').toBe(true);
  });
});
