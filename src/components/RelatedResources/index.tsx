import React from 'react';

export interface RelatedResourceLink {
  href: string;
  label: string;
  type?: 'primary' | 'secondary' | 'outline';
  external?: boolean;
}

export interface RelatedResourcesProps {
  title?: string;
  description?: string;
  links: RelatedResourceLink[];
  className?: string;
}

/**
 * Related Resources Component
 * Displays a card with related documentation links and resources
 */
export default function RelatedResources({
  title = '🔗 Related Resources',
  description,
  links,
  className = ''
}: RelatedResourcesProps): React.JSX.Element {
  return (
    <section className={`margin-top--lg ${className}`}>
      <div className="card shadow--lw">
        <div className="card__body text--center">
          <h3 className="margin-bottom--sm">{title}</h3>
          {description && (
            <p className="margin-bottom--lg text--secondary">{description}</p>
          )}
          <div className="button-group">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`button button--${link.type || 'primary'}`}
                {...(link.external && {
                  target: '_blank',
                  rel: 'noopener noreferrer'
                })}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
