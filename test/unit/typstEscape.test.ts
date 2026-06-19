import { describe, expect, it } from 'vitest';
import { typstEscape } from '@/domain/letter/typstEscape';

describe('typstEscape', () => {
  it('escapes Typst special characters', () => {
    expect(typstEscape('a#b[c]d\\"e')).toBe('a\\#b\\[c\\]d\\\\\\"e');
  });

  it('preserves German umlauts', () => {
    expect(typstEscape('Grüße')).toBe('Grüße');
  });
});
