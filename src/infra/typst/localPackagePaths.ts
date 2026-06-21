import type { CatalogPackage } from './localTypstPackages';
import { packagePublicUrlBase } from './localTypstPackages';
import { appUrl } from '../appUrl';

export function localPackageUrlBase(spec: Pick<CatalogPackage, 'name' | 'version'>): string {
  return appUrl(packagePublicUrlBase(spec));
}
