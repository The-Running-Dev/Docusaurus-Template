import type { ReactNode } from 'react';
import React, { useRef, useState, useEffect } from 'react';

import './tooltip.css';

interface TooltipProps {
  /**
   * The content to wrap with the tooltip
   */
  children: ReactNode;

  /**
   * The title/heading for the tooltip
   */
  title: string;

  /**
   * Array of items to display as tags
   */
  items: string[];

  /**
   * Whether the tooltip is currently visible
   */
  isVisible?: boolean;

  /**
   * Position of the tooltip relative to the trigger element
   * If 'auto', will automatically choose best position based on screen space
   */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';

  /**
   * Custom CSS class for the tooltip container
   */
  className?: string;
}

/**
 * Reusable Tooltip component for displaying information on hover
 *
 * Shows a title and collection of items as styled tags in a box layout.
 * Automatically handles hover states and positioning.
 */
export default function Tooltip({
  children,
  title,
  items,
  position = 'auto',
  className = ''
}: TooltipProps): ReactNode {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [actualPosition, setActualPosition] = useState<
    'top' | 'bottom' | 'left' | 'right'
  >('bottom');

  useEffect(() => {
    const updatePosition = () => {
      if (!wrapperRef.current) return;

      if (position !== 'auto') {
        setActualPosition(position);
        return;
      }

      const rect = wrapperRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate available space in each direction
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = viewportWidth - rect.right;

      // Tooltip estimated dimensions
      const tooltipHeight = 200;
      const tooltipWidth = 300;

      // Prefer bottom, then top, then sides
      if (spaceBelow >= tooltipHeight) {
        setActualPosition('bottom');
      } else if (spaceAbove >= tooltipHeight) {
        setActualPosition('top');
      } else if (spaceRight >= tooltipWidth) {
        setActualPosition('right');
      } else if (spaceLeft >= tooltipWidth) {
        setActualPosition('left');
      } else {
        setActualPosition('bottom'); // Default fallback
      }
    };

    // Update position on hover
    const handleMouseEnter = () => {
      updatePosition();
    };

    const element = wrapperRef.current;
    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
      };
    }
  }, [position]);

  if (items.length === 0) {
    return <div className={`tooltip-wrapper ${className}`}>{children}</div>;
  }

  return (
    <div ref={wrapperRef} className={`tooltip-wrapper ${className}`}>
      {children}

      <div className={`tooltip tooltip--${actualPosition}`}>
        <div className="tooltip__content">
          <div className="tooltip__header">
            <strong className="tooltip__title">{title}</strong>
          </div>

          <div className="tooltip__body">
            <div className="tooltip__tags">
              {items.map((item, index) => (
                <span key={index} className="tooltip__tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tooltip arrow */}
        <div
          className={`tooltip__arrow tooltip__arrow--${actualPosition}`}
        ></div>
      </div>
    </div>
  );
}
