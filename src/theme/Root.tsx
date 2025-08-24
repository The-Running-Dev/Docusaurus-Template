import React from 'react';
import { ThemeInitializer } from '../hooks/useThemeInitialization';
import { themes, defaultTheme } from '../components/ThemeSwitcher/themes';
import { useAppInitialization } from '../hooks/useAppInitialization';

//import { ConfigurationProvider } from '../components/ConfigurationManager';

// This is a Docusaurus root wrapper that provides global configuration context
export default function Root({
  children
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  // Initialize global data store
  useAppInitialization();

  return (
    <>
      {/* Initialize theme regardless of theme switcher component visibility */}
      <ThemeInitializer themes={themes} defaultTheme={defaultTheme} />

      {/* <ConfigurationProvider> */}
      {children}
      {/* </ConfigurationProvider> */}
    </>
  );
}
