export type Link = { label: string; href: string };

export type Badge = { alt: string; src: string };

export type Bullet = string;

export type Role = {
  icon?: string;
  company: string;
  title: string;
  location?: string;
  period: string;
  website?: string;
  summary?: string;
  achievements?: Bullet[];
  tech?: string;
};

export type Education = {
  school: string;
  degree: string;
  details?: string;
};

export type Project = {
  title: string;
  link?: string;
  description: string;
  tech: string;
  year: number | string;
};

export type OpenSourceContribution = {
  title: string;
  link?: string;
  description: string;
  impact: string;
  tech: string;
};

export type TimelineProject = {
  period: string;
  focus: string;
  projects: string[];
};

export type CVData = {
  header: {
    title: string;
    email?: string;
    phone?: string;
    links?: Link[];
  };
  about: {
    title: string;
    body: string;
  };
  badges?: Badge[];
  chips?: string[];
  timelineTitle: string;
  roles: Role[];
  educationTitle?: string;
  education?: Education[];
  projectsTitle?: string;
  projects?: Project[];
  openSourceTitle?: string;
  openSource?: OpenSourceContribution[];
  timelineProjectsTitle?: string;
  timelineProjects?: TimelineProject[];
  quote?: string;
};
