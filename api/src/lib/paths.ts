import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

// Project root (repo root), not the api folder
export const ROOT = path.join(here, '..', '..', '..'); // repo root
export const API_ROOT = path.join(ROOT, 'api');
export const CONFIG_DIR = path.join(ROOT, 'config');
export const STATIC_DIR = path.join(ROOT, 'static');
export const THEMES_DIR = path.join(STATIC_DIR, 'themes');
export const SRC_DIR = path.join(ROOT, 'src');
export const PAGES_DIR = path.join(SRC_DIR, 'pages');
export const STORAGE_DIR = path.join(API_ROOT, 'storage');
