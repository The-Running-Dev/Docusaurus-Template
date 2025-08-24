import { type ReactNode } from 'react';

interface CardGridProps {
  className?: string;
  children: ReactNode;
}

export default function CardGrid({ className = 'projectGrid', children }: CardGridProps): ReactNode {
  return (
    <div className={className}>
      {children}
    </div>
  );
}