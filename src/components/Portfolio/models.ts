export type PortfolioData = {
  header: {
    title: string;

    subtitle: string;
  };

  technologies: Technology[];

  projects: Project[];

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

export type StatItem = {
  number: string;

  label: string;
};
