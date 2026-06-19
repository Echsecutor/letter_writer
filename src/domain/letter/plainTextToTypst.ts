import { typstEscape } from './typstEscape';

export function plainTextToTypst(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph
        .split('\n')
        .map((line) => typstEscape(line))
        .join('\n'),
    )
    .join('\n\n');
}
