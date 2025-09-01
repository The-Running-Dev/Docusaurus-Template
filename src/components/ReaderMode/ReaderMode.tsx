import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen } from '@fortawesome/free-solid-svg-icons';

import FeatureComponent from '../FeatureComponent';
import { Features } from '../../config/FeaturesConfig';

import './ReaderMode.css';

/**
 * Reader Mode Component
 * Toggles a distraction-free reading mode with optimized typography and layout
 *
 * Features:
 * - Saves selection to localStorage
 * - Loads saved preference on component mount
 * - Applies reader mode styles globally via CSS classes
 * - Strips unnecessary UI elements and optimizes typography
 */
const ReaderModeContent: React.FC = () => {
  const [isReaderMode, setIsReaderMode] = useState<boolean>(false);

  useEffect(() => {
    // Load saved reader mode preference from localStorage
    let savedReaderMode = false;
    try {
      const stored = localStorage.getItem('docusaurus-reader-mode');
      savedReaderMode = stored === 'true';
    } catch (error) {
      console.warn('Failed to load reader mode preference:', error);
    }

    setIsReaderMode(savedReaderMode);
    applyReaderMode(savedReaderMode);
  }, []);

  const applyReaderMode = (enableReaderMode: boolean) => {
    try {
      if (enableReaderMode) {
        document.documentElement.classList.add('reader-mode-active');
      } else {
        document.documentElement.classList.remove('reader-mode-active');
      }

      // Save to localStorage
      localStorage.setItem('docusaurus-reader-mode', enableReaderMode.toString());
      setIsReaderMode(enableReaderMode);
    } catch (error) {
      console.error('Failed to apply reader mode:', error);
    }
  };

  const handleToggleReaderMode = () => {
    const newReaderMode = !isReaderMode;
    applyReaderMode(newReaderMode);
  };

  return (
    <div className="reader-mode">
      <button
        className="reader-mode__button"
        onClick={handleToggleReaderMode}
        aria-label={isReaderMode ? 'Exit Reader Mode' : 'Enter Reader Mode'}
        title={isReaderMode ? 'Exit Reader Mode' : 'Enter Reader Mode'}
      >
        <FontAwesomeIcon
          icon={isReaderMode ? faBookOpen : faBook}
          className="reader-mode__icon"
        />
      </button>
    </div>
  );
};

const ReaderMode: React.FC = () => {
  return (
    <FeatureComponent feature={Features.ReaderMode} configData={{}}>
      {() => <ReaderModeContent />}
    </FeatureComponent>
  );
};

export default ReaderMode;
