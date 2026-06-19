import { fileURLToPath } from 'node:url';
import path from 'node:path';

const testDir = path.dirname(fileURLToPath(import.meta.url));

export const fixturesDir = path.resolve(testDir, '../fixtures');
export const templatesDir = path.resolve(testDir, '../../templates');

export function fixturePath(name: string): string {
  return path.join(fixturesDir, name);
}

export function templatePath(name: string): string {
  return path.join(templatesDir, name);
}
