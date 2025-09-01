import React, { useState, useEffect } from 'react';

import FeatureComponent from '../FeatureComponent';
import { Features } from '../../config/FeaturesConfig';

import './TextSizeSwitcher.css';
import './text-size-switcher-reader.css';

interface TextSize {
  name: string;
  displayName: string;
  scale: number;
  className: string;
}

const textSizes: TextSize[] = [
  {
    name: 'small',
    displayName: 'Small',
    scale: 0.9,
    className: 'text-size-small'
  },
  {
    name: 'medium',
    displayName: 'Medium',
    scale: 1.0,
    className: 'text-size-medium'
  },
  {
    name: 'large',
    displayName: 'Large',
    scale: 1.1,
    className: 'text-size-large'
  },
  {
    name: 'extra-large',
    displayName: 'Extra Large',
    scale: 1.2,
    className: 'text-size-extra-large'
  }
];

const defaultTextSize: TextSize = textSizes[1]; // Medium

/**
 * Text Size Switcher Component
 * Allows users to switch between different text sizes
 *
 * Features:
 * - Saves selection to localStorage (consistent with ThemeSwitcher)
 * - Loads saved preference on component mount with validation
 * - Shows current size dynamically in the button icon
 * - Applies text size globally via CSS classes on document root
 */
const TextSizeSwitcherContent: React.FC = () => {
  const [currentSize, setCurrentSize] = useState<string>(defaultTextSize.name);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Ensure DOM is ready before applying text size
    const initializeTextSize = () => {
      // Load saved text size from localStorage, fallback to defaultTextSize
      let savedSize: string;
      try {
        savedSize =
          localStorage.getItem('docusaurus-text-size') || defaultTextSize.name;

        // Validate that the saved size exists in our textSizes array
        const isValidSize = textSizes.some((size) => size.name === savedSize);
        if (!isValidSize) {
          savedSize = defaultTextSize.name;
        }
      } catch (error) {
        console.warn('Failed to load text size preference:', error);
        savedSize = defaultTextSize.name;
      }

      setCurrentSize(savedSize);
      applyTextSize(savedSize);
    };

    // Run immediately if DOM is ready, otherwise wait for it
    if (
      typeof document !== 'undefined' &&
      (document.readyState === 'complete' ||
        document.readyState === 'interactive')
    ) {
      initializeTextSize();
    } else {
      const handleDOMContentLoaded = () => {
        initializeTextSize();
        if (typeof document !== 'undefined') {
          document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
        }
      };
      if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
      }

      return () => {
        if (typeof document !== 'undefined') {
          document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
        }
      };
    }
  }, []);

  // Additional effect to re-apply text size after any route changes
  useEffect(() => {
    // Track timers so we can cancel on unmount
    const timers = new Set<number>();
    const reapplyTextSize = () => {
      if (typeof document === 'undefined') return;
      if (currentSize) {
        const textSize = textSizes.find((s) => s.name === currentSize);
        if (textSize) {
          // Always remove all classes first, then add the correct one
          textSizes.forEach((size) => {
            if (typeof document !== 'undefined') {
              document.documentElement.classList.remove(size.className);
            }
          });
          document.documentElement.classList.add(textSize.className);
        }
      }
    };

    // Listen for popstate events (back/forward navigation)
    const handleNavigation = () => {
      const id = setTimeout(reapplyTextSize, 10) as unknown as number;
      timers.add(id);
    };

    // Listen for pushstate/replacestate (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      const id = setTimeout(reapplyTextSize, 10) as unknown as number;
      timers.add(id);
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      const id = setTimeout(reapplyTextSize, 10) as unknown as number;
      timers.add(id);
    };

    // Listen for hashchange (anchor navigation)
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleNavigation);
      window.addEventListener('hashchange', reapplyTextSize);
    }

    // Also listen for focus events (when returning to tab)
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', reapplyTextSize);
    }

    // Re-apply immediately and periodically check
    reapplyTextSize();
    const intervalId = setInterval(reapplyTextSize, 1000);

    return () => {
      // Restore original functions
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;

      // Remove event listeners
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handleNavigation);
        window.removeEventListener('hashchange', reapplyTextSize);
        window.removeEventListener('focus', reapplyTextSize);
      }
      // Clear any pending timers
      timers.forEach((id) => clearTimeout(id as unknown as number));
      clearInterval(intervalId);
    };
  }, [currentSize]);

  const applyTextSize = (sizeName: string) => {
    try {
      if (typeof document === 'undefined') return;
      // Remove existing text size classes
      textSizes.forEach((size) => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove(size.className);
        }
      });

      // Find the text size
      const textSize = textSizes.find((s) => s.name === sizeName);

      if (!textSize) {
        console.warn(`Text size '${sizeName}' not found, using default`);
        return;
      }

      // Apply the class immediately
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add(textSize.className);
      }

      // Also set CSS custom properties as backup
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty(
          '--text-size-scale',
          textSize.scale.toString()
        );
      }

      // Use requestAnimationFrame to ensure it sticks
      requestAnimationFrame(() => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.add(textSize.className);
        }
      });

      // Double-check after a short delay
      setTimeout(() => {
        if (typeof document !== 'undefined') {
          if (
            !document.documentElement.classList.contains(textSize.className)
          ) {
            document.documentElement.classList.add(textSize.className);
          }
        }
      }, 50);

      // Save to localStorage (consistent with ThemeSwitcher)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('docusaurus-text-size', sizeName);
      }

      setCurrentSize(sizeName);
    } catch (error) {
      console.error('Failed to apply text size:', error);
    }
  };

  const handleTextSizeChange = (sizeName: string) => {
    applyTextSize(sizeName);
    setIsOpen(false);
  };

  const currentTextSizeDisplayName =
    textSizes.find((s) => s.name === currentSize)?.displayName ||
    defaultTextSize.displayName;

  const currentTextSizeScale =
    textSizes.find((s) => s.name === currentSize)?.scale ||
    defaultTextSize.scale;

  return (
    <div className="text-size-switcher">
      <button
        className="text-size-switcher__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Change Text Size (Current: ${currentTextSizeDisplayName})`}
        title={`Current: ${currentTextSizeDisplayName}`}
      >
        <span
          className="text-size-switcher__button-icon"
          style={{ fontSize: `${currentTextSizeScale}rem` }}
        >
          Aa
        </span>
      </button>

      {isOpen && (
        <div className="text-size-switcher__dropdown">
          <div className="text-size-switcher__header">Text Size</div>
          {textSizes.map((textSize) => (
            <button
              key={textSize.name}
              className={`text-size-switcher__option ${
                currentSize === textSize.name
                  ? 'text-size-switcher__option--active'
                  : ''
              }`}
              onClick={() => handleTextSizeChange(textSize.name)}
            >
              <span
                className="text-size-switcher__size-preview"
                style={{ fontSize: `${textSize.scale}rem` }}
              >
                Aa
              </span>
              {textSize.displayName}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="text-size-switcher__backdrop" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

const TextSizeSwitcher: React.FC = () => {
  return (
    <FeatureComponent
      feature={Features.TextSizeSwitcher}
      configData={{}} // No config data needed for this component
    >
      {() => <TextSizeSwitcherContent />}
    </FeatureComponent>
  );
};

export default TextSizeSwitcher;
