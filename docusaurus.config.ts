import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import { getData } from './src/data';
import { GlobalConfig } from './src/entities';
import { globalConfig as configData } from './data/';

const globalConfig = getData<GlobalConfig>(configData);
const config: Config = {
  ...globalConfig.site,
  trailingSlash: false,
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  markdown: {
    mermaid: true
  },
  themes: ['@docusaurus/theme-mermaid'],
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          path: 'docs',
          id: 'default',
          routeBasePath: 'docs'
        },
        theme: {
          customCss: './static/themes/default.css'
        }
      } satisfies Preset.Options
    ]
  ],
  themeConfig: {
    ...globalConfig.theme,
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      ...globalConfig?.theme?.navbar,
      hideOnScroll: false,
      items: [
        {
          type: 'doc',
          docId: 'template-overview',
          position: 'left',
          label: 'Docs'
        },
        {
          type: 'custom-CV',
          position: 'left'
        },
        {
          type: 'custom-Portfolio',
          position: 'left'
        },
        {
          type: 'custom-Projects',
          position: 'left'
        },
        {
          type: 'custom-NavBarLinks',
          position: 'left'
        },
        {
          type: 'custom-VersionDisplay',
          position: 'right'
        },
        {
          type: 'custom-ThemeSwitcher',
          position: 'right'
        },
        {
          type: 'custom-TextSizeSwitcher',
          position: 'right'
        },
        {
          type: 'custom-ReaderMode',
          position: 'right'
        }
      ]
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
};

export default config;
