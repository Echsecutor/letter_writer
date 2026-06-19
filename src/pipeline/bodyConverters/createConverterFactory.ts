import type { BodyConverter, BodyConverterFactory } from './types';

/** Lazily creates a single converter instance from an async convert delegate. */
export function createConverterFactory(
  convertFn: (markdown: string) => Promise<string>,
): BodyConverterFactory {
  let instance: BodyConverter | null = null;

  return {
    create(): Promise<BodyConverter> {
      instance ??= { convert: convertFn };
      return Promise.resolve(instance);
    },
  };
}
