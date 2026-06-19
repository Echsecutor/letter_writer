export interface LocalPackageSpec {
  namespace: string;
  name: string;
  version: string;
}

export interface LocalPackageRegistry {
  resolve(spec: LocalPackageSpec): string | undefined;
}

export interface CatalogPackage {
  namespace: 'local';
  name: string;
  version: string;
}

export const CATALOG_PACKAGES: readonly CatalogPackage[] = [
  { namespace: 'local', name: 'letter-pro', version: '3.0.0' },
  { namespace: 'local', name: 'briefs', version: '0.3.0' },
  { namespace: 'local', name: 'pc-letter', version: '0.4.0' },
] as const;

export function packageMemoryDir(spec: Pick<CatalogPackage, 'name' | 'version'>): string {
  return `/@memory/packages/local/${spec.name}/${spec.version}`;
}

export function packagePublicUrlBase(spec: Pick<CatalogPackage, 'name' | 'version'>): string {
  return `/typst-packages/local/${spec.name}/${spec.version}`;
}

export function createLocalPackageRegistry(): LocalPackageRegistry {
  return {
    resolve(spec: LocalPackageSpec) {
      const match = CATALOG_PACKAGES.find(
        (entry) =>
          entry.namespace === spec.namespace &&
          entry.name === spec.name &&
          entry.version === spec.version,
      );
      return match ? packageMemoryDir(match) : undefined;
    },
  };
}

export function registerPackageFiles(
  accessModel: { insertFile: (path: string, content: Uint8Array, mtime: Date) => void },
  spec: Pick<CatalogPackage, 'name' | 'version'>,
  files: ReadonlyArray<{ relativePath: string; content: Uint8Array }>,
): void {
  const dir = packageMemoryDir(spec);
  const mtime = new Date();
  for (const file of files) {
    accessModel.insertFile(`${dir}/${file.relativePath}`, file.content, mtime);
  }
}
