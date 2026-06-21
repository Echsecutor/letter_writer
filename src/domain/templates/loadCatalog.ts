import type { TemplateCatalog, TemplateCatalogEntry } from './schemaTypes';
import { appUrl } from '@/infra/appUrl';

export function loadCatalog(): Promise<TemplateCatalogEntry[]> {
  return fetch(appUrl('templates/catalog.json'))
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Failed to load template catalog');
      }
      const catalog = (await response.json()) as TemplateCatalog;
      return catalog.templates;
    });
}
