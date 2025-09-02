import { z } from 'zod';

export const ProjectSchema = z.object({
  title: z.string().min(1),
  link: z.string().url().or(z.string().min(1)).optional(),
  lastModified: z.union([z.string(), z.date()]).optional(),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  repoUrl: z.string().url().optional(),
  stats: z
    .object({
      stars: z.number(),
      forks: z.number(),
      language: z.string(),
      size: z.number(),
      lastCommit: z.union([z.string(), z.date()]),
      openIssues: z.number()
    })
    .optional(),
  lastSyncedAt: z.union([z.string(), z.date()]).optional(),
  syncEnabled: z.boolean().default(true),
  syncInterval: z.enum(['daily', 'weekly', 'disabled']).default('daily'),
  draft: z.boolean().optional()
});
