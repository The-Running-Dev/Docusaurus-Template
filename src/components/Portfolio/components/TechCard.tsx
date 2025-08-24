import { type ReactNode } from 'react';

interface TechItem {
  name: string;
  category: string;
  link?: string;
  subCategories?: string[];
}

interface TechCardProps {
  tech: TechItem;
  children?: ReactNode;
}

export default function TechCard({ tech, children }: TechCardProps): ReactNode {
  const techCardContent = (
    <div className="techItem">
      <span className="techName">
        {tech.name}
        {tech.subCategories && tech.subCategories.length > 0 && (
          <span className="techIndicator">▼</span>
        )}
      </span>
      <span className="techCategory">{tech.category}</span>
    </div>
  );

  if (children) {
    return <>{children}</>;
  }

  return techCardContent;
}