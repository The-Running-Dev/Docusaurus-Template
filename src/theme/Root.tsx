import React from 'react';
import { AuthProvider } from '../components/Auth/AuthProvider';
import { AuthToastContainer } from '../components/Auth/AuthToast';
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
    <AuthProvider>
      {/* Initialize theme regardless of theme switcher component visibility */}
      <ThemeInitializer themes={themes} defaultTheme={defaultTheme} />

      {/* Global toast notifications for auth and other events */}
      <AuthToastContainer />

      {/* <ConfigurationProvider> */}
      {children}
      {/* </ConfigurationProvider> */}
    </AuthProvider>
  );
}
