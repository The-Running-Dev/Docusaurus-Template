import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { CONFIG_DIR } from './paths';

export type YamlKey =
  | 'badges'
  | 'cvData'
  | 'giscus'
  | 'gitHub'
  | 'gitHubLinks'
  | 'globalConfig'
  | 'navBarLinks'
  | 'portfolioData'
  | 'projects'
  | 'version';

export function loadYaml<T = unknown>(key: YamlKey): T {
  const filePath = path.join(CONFIG_DIR, `${key}.yml`);
  if (!fs.existsSync(filePath)) {
    // Some files may use .yaml extension; try fallback
    const alt = path.join(CONFIG_DIR, `${key}.yaml`);
    if (!fs.existsSync(alt)) {
      throw Object.assign(new Error(`Config not found: ${key}`), {
        statusCode: 404
      });
    }
    return parseYaml<T>(alt);
  }
  return parseYaml<T>(filePath);
}

function parseYaml<T>(file: string): T {
  const raw = fs.readFileSync(file, 'utf8');
  const data = yaml.load(raw);
  return data as T;
}

export function listAvailableKeys(): YamlKey[] {
  return [
    'badges',
    'cvData',
    'giscus',
    'gitHub',
    'gitHubLinks',
    'globalConfig',
    'navBarLinks',
    'portfolioData',
    'projects',
    'version'
  ];
}
