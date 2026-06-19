import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { templatesRoot } from './loadTemplate.node';
import type { TemplateCatalog, TemplateCatalogEntry } from './schemaTypes';

export async function loadCatalogFromNode(): Promise<TemplateCatalogEntry[]> {
  const raw = await readFile(path.join(templatesRoot(), 'catalog.json'), 'utf8');
  const catalog = JSON.parse(raw) as TemplateCatalog;
  return catalog.templates;
}
