import React, { type ReactNode } from 'react';
import Heading from '@theme/Heading';

interface SectionProps {
  title?: string;
  className?: string;
  titleLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  titleClassName?: string;
  titleStyle?: React.CSSProperties;
  children: ReactNode;
}

export default function Section({ 
  title, 
  className, 
  titleLevel = 'h2', 
  titleClassName = 'sectionTitle',
  titleStyle,
  children 
}: SectionProps): ReactNode {
  return (
    <section className={className}>
      <div className="container">
        {title && (
          <Heading as={titleLevel} className={titleClassName} style={titleStyle}>
            {title}
          </Heading>
        )}
        {children}
      </div>
    </section>
  );
}