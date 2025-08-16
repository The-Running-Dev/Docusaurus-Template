import React from 'react';
import ReaderMode from '../../components/ReaderMode';
import { useFeaturesConfig } from '../../config/FeaturesConfig';

export default function ReaderModeNavbarItem(): React.JSX.Element {
  const featuresConfig = useFeaturesConfig();

  // Don't render if Reader Mode is disabled
  if (!featuresConfig.readerMode) {
    return null;
  }

  return <ReaderMode />;
}
