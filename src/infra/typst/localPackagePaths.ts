import type { CatalogPackage } from './localTypstPackages';
import { packagePublicUrlBase } from './localTypstPackages';

export function localPackageUrlBase(spec: Pick<CatalogPackage, 'name' | 'version'>): string {
  return packagePublicUrlBase(spec);
}
