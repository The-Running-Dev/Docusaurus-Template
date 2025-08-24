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

import DataProvider from '../DataProvider';
import Loading from '../Loading';
import { Badge, BadgeCategory, BadgesProps } from './models';
import { DEFAULT_BADGES_DATA } from './constants';

const Badges: React.FC<BadgesProps> = ({ user, repository, groups }) => {
  const createProcessor = (props: BadgesProps) => (data: any) => {
    const iconMap = {
      faCogs,
      faBoxOpen,
      faBook,
      faShieldAlt,
      faUsers,
      faChartLine
    };

    const replacements: Record<string, string> = {
      ...data.templateVariables,
      user: props.user || data.templateVariables?.user || '',
      repository: props.repository || data.templateVariables?.repository || ''
    };

    const processedCategories =
      data.badgeCategories
        ?.filter(
          (category: any) =>
            !props.groups || props.groups.includes(category.key)
        )
        ?.map((category: any) => ({
          ...category,
          icon:
            iconMap[category.iconName as keyof typeof iconMap] ||
            iconMap.faCogs,
          badges: category.badges?.map((badge: any) => {
            const process = (val: unknown) =>
              typeof val === 'string'
                ? val.replace(/\{(\w+)\}/g, (_: string, key: string) => replacements[key] || '')
                : val;
            return {
              ...badge,
              url: process(badge?.url),
              link: process(badge?.link)
            };
          })
        })) || [];

    return { badgeCategories: processedCategories };
  };

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
    <DataProvider
      defaultData={DEFAULT_BADGES_DATA}
      processor={createProcessor({ user, repository, groups })}
    >
      {(processedData, loading, error) => {
        if (loading) {
          return <Loading message="🔄 Loading Badges..." useWrap={false} />;
        }

        if (error) {
          return (
            <div style={{ padding: '1rem', color: 'var(--ifm-color-danger)' }}>
              Error loading badges: {error.message}
            </div>
          );
        }

        const { badgeCategories } = processedData;

        // Don't render if no badges
        if (!badgeCategories || badgeCategories.length === 0) {
          return null;
        }

        return (
          <div style={{ padding: '0.2rem 0' }}>
            {badgeCategories.map((category: BadgeCategory) => (
              <Category
                key={category.key}
                title={category.title}
                badges={category.badges}
                icon={category.icon}
              />
            ))}
          </div>
        );
      }}
    </DataProvider>
  );
};

export default Badges;
