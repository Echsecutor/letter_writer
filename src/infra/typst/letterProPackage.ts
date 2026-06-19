import { MemoryAccessModel } from '@myriaddreamin/typst.ts';

export interface LocalPackageSpec {
  namespace: string;
  name: string;
  version: string;
}

export interface LocalPackageRegistry {
  resolve(spec: LocalPackageSpec): string | undefined;
}

export const LETTER_PRO_PACKAGE_DIR = '/@memory/packages/local/letter-pro/3.0.0';

export const letterProPackageSpec: LocalPackageSpec = {
  namespace: 'local',
  name: 'letter-pro',
  version: '3.0.0',
};

export function createLocalLetterProRegistry(): LocalPackageRegistry {
  return {
    resolve(spec: LocalPackageSpec) {
      if (
        spec.namespace === letterProPackageSpec.namespace &&
        spec.name === letterProPackageSpec.name &&
        spec.version === letterProPackageSpec.version
      ) {
        return LETTER_PRO_PACKAGE_DIR;
      }
      return undefined;
    },
  };
}

export function registerLetterProFiles(
  accessModel: MemoryAccessModel,
  files: ReadonlyArray<{ relativePath: string; content: Uint8Array }>,
): void {
  const mtime = new Date();
  for (const file of files) {
    accessModel.insertFile(`${LETTER_PRO_PACKAGE_DIR}/${file.relativePath}`, file.content, mtime);
  }
}
