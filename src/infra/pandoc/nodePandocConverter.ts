import { createConverterFactory } from '../../pipeline/bodyConverters/createConverterFactory';
import type { BodyConverterFactory } from '../../pipeline/bodyConverters/types';
import { convertMarkdownBody } from './pandocWasm';

/** Node pandoc-wasm adapter for CI tests (lazy init handled by pandoc-wasm package). */
export const nodePandocConverterFactory: BodyConverterFactory =
  createConverterFactory(convertMarkdownBody);
