export type PortfolioData = {
  header: {
    title: string;

    subtitle: string;
  };

  technologies: Technology[];

  projects: ProjectCategory[];

  stats: StatItem[];

  seo: {
    title: string;

    description: string;
  };
};

export type Technology = {
  name: string;

  link: string;

  subCategories?: TechnologyItem[];
};

export type TechnologyItem = {
  name: string;

  link: string;

  subCategories?: string[];
};

export type FlattenedTechnologyItem = TechnologyItem & {
  category: string;
};

export type Project = {
  title: string;

  tag: string;

  description: string;

  link: string;

  icon: string;
};

export interface ProjectCategory {
  category: string;
  icon: string;
  description: string;
}

// Legacy interfaces - kept for Projects component compatibility
export interface ProjectSubCategory {
  name: string;
  description: string;
  projects: ProjectItem[];
}

export interface ProjectItem {
  title: string;
  link: string;
  lastModified: string;
  summary: string;
  tags: string[];
}

export type StatItem = {
  number: string;

  label: string;
};
