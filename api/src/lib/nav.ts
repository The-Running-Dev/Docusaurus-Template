import fs from 'node:fs';
import path from 'node:path';
import { PAGES_DIR } from './paths';

const DEMOS_DIR = path.join(PAGES_DIR, 'demos');

export interface NavLink {
  label: string;
  href: string;
  position?: 'left' | 'right';
}

export interface NavConfig {
  dropdown: boolean;
  dropdownLabel: string;
  links: NavLink[];
}

export function generateNav(): NavConfig {
  const links: NavLink[] = [];

  if (fs.existsSync(DEMOS_DIR)) {
    const entries = fs.readdirSync(DEMOS_DIR, { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile() && e.name.endsWith('.tsx')) {
        const base = e.name.replace(/\.tsx$/i, '');
        links.push({ label: toTitle(base), href: `/demos/${base}` });
      }
    }
  }

  links.sort((a, b) => a.label.localeCompare(b.label));

  return {
    dropdown: true,
    dropdownLabel: 'Demos',
    links
  };
}

function toTitle(slug: string): string {
  if (slug.toLowerCase() === '404') return '404 Page';
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}
