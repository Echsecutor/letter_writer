import { describe, expect, it } from 'vitest';
import { plainTextToTypst } from '@/domain/letter/plainTextToTypst';

describe('plainTextToTypst', () => {
  it('converts paragraphs separated by blank lines', () => {
    const input = 'First paragraph.\n\nSecond paragraph.';
    expect(plainTextToTypst(input)).toContain('First paragraph.');
    expect(plainTextToTypst(input)).toContain('Second paragraph.');
  });
});
