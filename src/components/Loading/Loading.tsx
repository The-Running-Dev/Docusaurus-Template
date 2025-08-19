import type { ReactNode } from 'react';

import './loading.css';

interface LoadingProps {
  /**
   * The main loading message (e.g., "🔄 Loading Projects...")
   */
  message: string;

  /**
   * Optional secondary message for additional context
   * (e.g., "Fetching Data and Filtering...")
   */
  secondaryMessage?: string;

  /**
   * Whether to use the wrapped styling (with card background and shadow)
   * Default: false
   */
  useWrap?: boolean;

  /**
   * Optional custom CSS class name for the container
   */
  containerClassName?: string;
}

/**
 * Reusable Loading component for data loading states
 *
 * Provides consistent loading UI across all data loading components
 * with customizable messages and styling options.
 */
export default function Loading({
  message,
  secondaryMessage,
  useWrap = false,
  containerClassName
}: LoadingProps): ReactNode {
  const containerClass = useWrap ? 'loading-wrap' : 'loading-container';
  const finalContainerClass = containerClassName
    ? `${containerClass} ${containerClassName}`
    : containerClass;

  return (
    <div className={finalContainerClass}>
      <p className="loading-message">{message}</p>
      {secondaryMessage && (
        <p className="loading-secondary">{secondaryMessage}</p>
      )}
    </div>
  );
}
