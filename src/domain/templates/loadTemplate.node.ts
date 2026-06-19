import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LoadedTemplate, LetterSchema } from './schemaTypes';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);

export function templatesRoot(): string {
  return path.join(repoRoot, 'templates');
}

export function loadTemplate(templateId: string): Promise<LoadedTemplate> {
  return loadTemplateFromNode(templateId);
}

export async function loadTemplateFromNode(templateId: string): Promise<LoadedTemplate> {
  const base = path.join(templatesRoot(), templateId);
  const [shell, schemaRaw] = await Promise.all([
    readFile(`${base}.typ`, 'utf8'),
    readFile(`${base}.schema.json`, 'utf8'),
  ]);

  return {
    id: templateId,
    shell,
    schema: JSON.parse(schemaRaw) as LetterSchema,
  };
}
