import type { Theme } from './models';

// @ts-ignore
import { themes as configData } from '../../../data';

export const themes: Theme[] = configData.themes;
export const defaultTheme: Theme =
  themes.find((t) => t.name === configData.defaultTheme) ||
  themes.find((t) => t.name === 'default') ||
  (themes.length > 0
    ? themes[0]
    : {
        name: 'default',
        displayName: 'Default',
        cssFile: 'themes/default.css'
      });
