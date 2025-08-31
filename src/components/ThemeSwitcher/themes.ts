import type { Theme } from './models';

// @ts-ignore
import { themes as configData } from '../../../data';

export const themes: Theme[] = configData.themes;

export function selectDefaultTheme(list: Theme[], desired?: string): Theme {
  return (
    list.find((t) => t.name === desired) ||
    list.find((t) => t.name === 'default') ||
    (list.length > 0
      ? list[0]
      : { name: 'default', displayName: 'Default', cssFile: 'themes/default.css' })
  );
}

export const defaultTheme: Theme = selectDefaultTheme(themes, configData.defaultTheme);
