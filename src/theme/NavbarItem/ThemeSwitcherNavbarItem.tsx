import React from 'react';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import { useFeaturesConfig } from '../../config/FeaturesConfig';

export default function ThemeSwitcherNavbarItem(): React.JSX.Element {
  const featuresConfig = useFeaturesConfig();

  // Don't render if Theme Switcher is disabled
  if (!featuresConfig.themeSwitcher) {
    return null;
  }

  return <ThemeSwitcher />;
}
