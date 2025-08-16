import React from 'react';
import TextSizeSwitcher from '../../components/TextSizeSwitcher';
import { useFeaturesConfig } from '../../config/FeaturesConfig';

export default function TextSizeSwitcherNavbarItem(): React.JSX.Element {
  const featuresConfig = useFeaturesConfig();

  // Don't render if Text Size Switcher is disabled
  if (!featuresConfig.textSizeSwitcher) {
    return null;
  }

  return <TextSizeSwitcher />;
}
