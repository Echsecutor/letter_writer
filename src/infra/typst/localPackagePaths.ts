import type { CatalogPackage } from './localTypstPackages';
import { packagePublicUrlBase } from './localTypstPackages';
import { publicUrl } from '../publicUrl';

export function localPackageUrlBase(spec: Pick<CatalogPackage, 'name' | 'version'>): string {
  return publicUrl(packagePublicUrlBase(spec));
}
