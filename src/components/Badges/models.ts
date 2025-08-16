import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface BadgeConfig {
  templateVariables: TemplateVariables;

  badgeCategories: BadgeCategory[];
}

export interface TemplateVariables {
  demoUrl: string;
  docsUrl: string;
  user: string;
  repository: string;
}

export interface Badge {
  name: string;
  url: string;
  link: string;
}

export interface BadgeCategory {
  key: string;
  title: string;
  icon: IconDefinition;
  badges: Badge[];
}

export interface BadgesProps {
  user?: string;
  repository?: string;
  groups?: string[]; // Optional array of group IDs to display
}

export interface BadgesData {
  badgeCategories: BadgeCategory[];
  loading: boolean;
}
