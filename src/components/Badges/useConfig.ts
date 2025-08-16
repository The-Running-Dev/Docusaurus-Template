import { useMemo } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCogs,
  faBoxOpen,
  faBook,
  faShieldAlt,
  faUsers,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

import { getData } from '../../data';
import { BadgesProps, BadgesData, BadgeCategory } from './models';

// @ts-ignore
import { badges as configData } from '../../../data';

export default function useConfig({
  user,
  repository,
  groups
}: BadgesProps = {}): BadgesData {
  const iconMap: Record<string, IconDefinition> = {
    faCogs,
    faBoxOpen,
    faBook,
    faShieldAlt,
    faUsers,
    faChartLine
  };

  const { badgeCategories, templateVariables } = getData(configData, {
    processor: (data) => {
      const badgeCategories = data.badgeCategories.map((category) => ({
        key: category.key,
        title: category.title,
        icon: iconMap[category.icon as unknown as string] || faCogs,
        badges: category.badges
      }));

      const templateVariables = data.templateVariables;

      return { badgeCategories, templateVariables };
    }
  });

  // Compute processed badge sections based on config and props
  const processedBadgeCategories = useMemo(() => {
    const replacements: Record<string, string> = {
      ...templateVariables,
      user: user || templateVariables.user,
      repository: repository || templateVariables.repository
    };

    return badgeCategories
      .filter(
        (category: BadgeCategory) => !groups || groups.includes(category.key)
      )
      .map((category: BadgeCategory) => ({
        key: category.key,
        title: category.title,
        icon: category.icon,
        badges: category.badges.map((badge) => ({
          name: badge.name,
          url: badge.url.replace(/\{(\w+)\}/g, (_, k) => replacements[k] || ''),
          link: badge.link.replace(
            /\{(\w+)\}/g,
            (_, k) => replacements[k] || ''
          )
        }))
      }));
  }, [badgeCategories, templateVariables, user, repository, groups]);

  return { badgeCategories: processedBadgeCategories, loading: false };
}
