import { convert } from 'pandoc-wasm';
import { PANDOC_MARKDOWN_TO_TYPST } from '../../pipeline/bodyConverters/pandocOptions';

/** Typed wrapper around pandoc-wasm convert for Anschreiben markdown → Typst fragments. */
export async function convertMarkdownBody(markdown: string): Promise<string> {
  const result = await convert(PANDOC_MARKDOWN_TO_TYPST, markdown, {});
  return result.stdout;
}
