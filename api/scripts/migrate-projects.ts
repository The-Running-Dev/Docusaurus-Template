#!/usr/bin/env tsx
/**
 * Split config/projects.yml into per-project JSON files under storage.
 *
 * Usage:
 *   pnpm --dir api migrate:projects [--overwrite]
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

import { STORAGE_DIR as STORAGE_ROOT, CONFIG_DIR } from '../src/lib/paths.js';
import { ProjectSchema, slugify } from '../src/lib/projectsStore.js';

const OVERWRITE = process.argv.includes('--overwrite');

const PROJECTS_YAML = path.join(CONFIG_DIR, 'projects.yml');
const PROJECTS_DIR = path.join(STORAGE_ROOT, 'projects');

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJsonAtomic(filePath: string, data: unknown) {
  ensureDir(path.dirname(filePath));
  const tmp = `${filePath}.tmp`;
  const backup = `${filePath}.${Date.now()}.bak`;
  const json = JSON.stringify(data, null, 2);
  if (fs.existsSync(filePath)) {
    if (!OVERWRITE) return; // skip
    fs.copyFileSync(filePath, backup);
  }
  fs.writeFileSync(tmp, json, 'utf8');
  fs.renameSync(tmp, filePath);
}

function main() {
  if (!fs.existsSync(PROJECTS_YAML)) {
    console.error('projects.yml not found at', PROJECTS_YAML);
    process.exit(1);
  }

  const raw = fs.readFileSync(PROJECTS_YAML, 'utf8');
  const data = yaml.load(raw) as any[];
  if (!Array.isArray(data)) {
    console.error('projects.yml did not parse to an array');
    process.exit(1);
  }

  let written = 0;
  let skipped = 0;
  for (const cat of data) {
    const category = String(cat.category);
    const subCategories = Array.isArray(cat.subCategories)
      ? cat.subCategories
      : [];

    for (const sub of subCategories) {
      const subCategory = String(sub.name);
      const projects = Array.isArray(sub.projects) ? sub.projects : [];

      for (const p of projects) {
        try {
          const proj = ProjectSchema.parse({
            title: p.title,
            link: p.link ?? undefined,
            lastModified: p.lastModified ?? undefined,
            summary: p.summary,
            tags: Array.isArray(p.tags) ? p.tags : []
          });
          const normalized = {
            ...proj,
            lastModified:
              proj.lastModified instanceof Date
                ? proj.lastModified.toISOString()
                : proj.lastModified
          };
          const s = slugify(normalized.title);
          const file = path.join(PROJECTS_DIR, category, subCategory, `${s}.json`);
          if (fs.existsSync(file) && !OVERWRITE) {
            skipped++;
            continue;
          }
          writeJsonAtomic(file, normalized);
          written++;
        } catch (e: any) {
          console.warn('Skipping invalid project', p?.title || '(no title)', e?.message);
        }
      }
    }
  }

  console.log(`Migration complete. Written: ${written}, Skipped: ${skipped}`);
}

main();
