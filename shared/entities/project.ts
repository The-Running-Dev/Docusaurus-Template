export interface Project {
  id?: string;
  title: string;
  link?: string;
  lastModified?: string | Date;
  summary: string;
  tags?: string[];
  repoUrl?: string;
  stats?: RepoStats;
  lastSyncedAt?: string | Date;
  syncEnabled?: boolean;
  syncInterval?: 'daily' | 'weekly' | 'disabled';
  draft?: boolean;
}

export interface RepoStats {
  stars: number;
  forks: number;
  language: string;
  size: number;
  lastCommit: string | Date;
  openIssues: number;
}
