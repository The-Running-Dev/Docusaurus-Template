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
  quote?: string;
};
