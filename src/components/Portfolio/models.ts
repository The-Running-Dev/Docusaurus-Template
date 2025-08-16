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
  category: string;
};

export type Project = {
  title: string;
  description: string;
  link: string;
  icon: string;
};

export type StatItem = {
  number: string;
  label: string;
};
