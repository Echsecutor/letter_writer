/** Search PDF bytes for embedded text strings (simple scan, no PDF parser). */
export function pdfContainsText(pdf: Uint8Array, text: string): boolean {
  const haystack = new TextDecoder('latin1').decode(pdf);
  return haystack.includes(text);
}

/** Assert that every fragment appears somewhere in the PDF byte stream. */
export function pdfContainsAllText(pdf: Uint8Array, fragments: string[]): boolean {
  return fragments.every((fragment) => pdfContainsText(pdf, fragment));
}
