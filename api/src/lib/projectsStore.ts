import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import yaml from 'js-yaml';
import { STORAGE_DIR as STORAGE_ROOT, CONFIG_DIR } from './paths';

const STORAGE_DIR = path.join(STORAGE_ROOT, 'projects');
const CONFIG_PROJECTS_YAML = path.join(CONFIG_DIR, 'projects.yml');

// Schema for a single project entry
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
  syncInterval: z.enum(['daily', 'weekly', 'disabled']).default('daily')
});
export type Project = z.infer<typeof ProjectSchema>;

export interface SubCategory {
  name: string;
  projects: Project[];
}

export interface Category {
  category: string;
  subCategories: SubCategory[];
}

export interface FlatProject {
  id?: number;
  category: string;
  subCategory: string;
  slug: string;
  project: Project;
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

function writeJsonAtomic(filePath: string, data: any) {
  ensureDir(path.dirname(filePath));
  const tmp = `${filePath}.tmp`;
  const backup = `${filePath}.${Date.now()}.bak`;
  const json = JSON.stringify(data, null, 2);
  // Backup if exists
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backup);
  }
  fs.writeFileSync(tmp, json, 'utf8');
  fs.renameSync(tmp, filePath);
}

function listFilesRecursive(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFilesRecursive(p));
    else if (e.isFile() && e.name.endsWith('.json')) out.push(p);
  }
  return out.sort();
}

export function getFlatFromStorage(): FlatProject[] {
  const files = listFilesRecursive(STORAGE_DIR);
  const result: FlatProject[] = [];
  for (const file of files) {
    const rel = path.relative(STORAGE_DIR, file).replace(/\\/g, '/');
    const parts = rel.split('/');
    if (parts.length < 3) continue;
    const [category, subCategory, name] = parts;
    const slug = name.replace(/\.json$/i, '');
    const proj = readJsonFile<Project>(file);
    if (!proj) continue;
    result.push({ category, subCategory, slug, project: proj });
  }
  return result;
}

export function combineToNested(projects: FlatProject[]): Category[] {
  const byCategory = new Map<string, Map<string, Project[]>>();
  for (const { category, subCategory, project } of projects) {
    if (!byCategory.has(category)) byCategory.set(category, new Map());
    const sub = byCategory.get(category)!;
    if (!sub.has(subCategory)) sub.set(subCategory, []);
    sub.get(subCategory)!.push(project);
  }
  // Order stable by key
  const categories: Category[] = [];
  for (const [category, subMap] of Array.from(byCategory.entries()).sort()) {
    const subCats: SubCategory[] = [];
    for (const [name, projects] of Array.from(subMap.entries()).sort()) {
      subCats.push({ name, projects });
    }
    categories.push({ category, subCategories: subCats });
  }
  return categories;
}

export function getProjectsCombined(): Category[] {
  const flat = getFlatFromStorage();
  if (flat.length > 0) return combineToNested(flat);
  // Fallback to YAML if no storage yet
  if (fs.existsSync(CONFIG_PROJECTS_YAML)) {
    const raw = fs.readFileSync(CONFIG_PROJECTS_YAML, 'utf8');
    const yamlData = yaml.load(raw) as any;
    return yamlData as Category[];
  }
  return [];
}

export function getProject(
  category: string,
  subCategory: string,
  slug: string
): Project | null {
  const file = path.join(STORAGE_DIR, category, subCategory, `${slug}.json`);
  return readJsonFile<Project>(file);
}

export function saveProject(
  category: string,
  subCategory: string,
  slug: string,
  input: unknown
): Project {
  const parsed = ProjectSchema.parse(input);
  const normalized: Project = {
    ...parsed,
    lastModified: parsed.lastModified instanceof Date
      ? parsed.lastModified.toISOString()
      : parsed.lastModified
  } as any;
  const file = path.join(STORAGE_DIR, category, subCategory, `${slug}.json`);
  writeJsonAtomic(file, normalized);
  return normalized;
}

export function deleteProject(
  category: string,
  subCategory: string,
  slug: string
) {
  const file = path.join(STORAGE_DIR, category, subCategory, `${slug}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}
