import fs from 'node:fs';
import path from 'node:path';
import { THEMES_DIR } from './paths';

export interface ThemeInfo {
  name: string; // theme-id
  displayName: string; // theme-name
  cssFile: string; // relative URL from site root
}

export function loadThemes(): ThemeInfo[] {
  if (!fs.existsSync(THEMES_DIR)) return [];

  const files = fs
    .readdirSync(THEMES_DIR)
    .filter((f) => f.endsWith('.css'))
    .sort();

  return files.map((file) => extractFromCss(path.join(THEMES_DIR, file)));
}

function extractFromCss(filePath: string): ThemeInfo {
  const fileName = path.basename(filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  const header = raw.split(/\r?\n/).slice(0, 20); // search first 20 lines

  let id: string | undefined;
  let name: string | undefined;

  for (const line of header) {
    const idMatch = line.match(/@theme-id:\s*([^\s]+)/i);
    if (idMatch) id = idMatch[1].trim();

    const nameMatch = line.match(/@theme-name:\s*(.+)$/i);
    if (nameMatch) name = nameMatch[1].trim();
  }

  const fallbackId = fileName.replace(/\.css$/i, '');
  return {
    name: id ?? fallbackId,
    displayName: name ?? toTitleCase(fallbackId.replace(/[-_]/g, ' ')),
    cssFile: `themes/${fileName}`
  };
}

function toTitleCase(text: string): string {
  return text
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}
