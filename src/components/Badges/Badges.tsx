import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCogs,
  faBoxOpen,
  faBook,
  faShieldAlt,
  faUsers,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

import { Badge, BadgeCategory, BadgesProps } from './models';
import { getData } from '../../data';

// @ts-ignore
import { badges as configData } from '../../../data';

const Badges: React.FC<BadgesProps> = () => {
  // Load badge configuration directly using getData with processor
  const { badgeCategories } = getData(configData, {
    processor: (data) => {
      const iconMap = {
        faCogs,
        faBoxOpen,
        faBook,
        faShieldAlt,
        faUsers,
        faChartLine
      };

      const processedCategories =
        data.badgeCategories?.map((category: any) => ({
          ...category,
          icon:
            iconMap[category.iconName as keyof typeof iconMap] ||
            iconMap.faCogs,
          badges: category.badges?.map((badge: any) => {
            let processedUrl = badge.url;
            // Process template variables if they exist
            if (data.templateVariables) {
              Object.entries(data.templateVariables).forEach(([key, value]) => {
                processedUrl = processedUrl.replace(
                  new RegExp(`{{${key}}}`, 'g'),
                  value as string
                );
              });
            }
            return { ...badge, url: processedUrl };
          })
        })) || [];

      return { badgeCategories: processedCategories };
    }
  });

  // Don't render if no badges
  if (!badgeCategories || badgeCategories.length === 0) {
    return null;
  }

  const Category: React.FC<BadgeCategory> = ({ title, badges, icon }) => (
    <div style={{ marginBottom: '2rem' }}>
      <h3
        style={{
          fontSize: '1.2rem',
          marginBottom: '1rem',
          color: 'var(--ifm-color-primary)',
          borderBottom: '2px solid var(--ifm-color-primary-light)',
          paddingBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <FontAwesomeIcon
          icon={icon}
          style={{ color: 'var(--ifm-color-primary)' }}
        />
        {title}
      </h3>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center'
        }}
      >
        {badges.map((badge: Badge, index: number) => (
          <a
            key={index}
            href={badge.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <img
              src={badge.url}
              alt={badge.name}
              style={{
                height: '20px',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e: React.MouseEvent<HTMLImageElement>) => {
                (e.target as HTMLImageElement).style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e: React.MouseEvent<HTMLImageElement>) => {
                (e.target as HTMLImageElement).style.transform = 'scale(1)';
              }}
            />
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '0.2rem 0' }}>
      {badgeCategories.map((category) => (
        <Category
          key={category.key}
          title={category.title}
          badges={category.badges}
          icon={category.icon}
        />
      ))}
    </div>
  );
};

export default Badges;
