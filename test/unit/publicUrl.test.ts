import { describe, expect, it } from 'vitest';
import { joinPublicUrl, publicUrl } from '@/infra/publicUrl';

describe('publicUrl', () => {
  it('joins subpath bases without duplicating slashes', () => {
    expect(joinPublicUrl('/letter_writer/', 'templates/catalog.json')).toBe(
      '/letter_writer/templates/catalog.json',
    );
    expect(joinPublicUrl('/letter_writer/', '/templates/letter-pro.typ')).toBe(
      '/letter_writer/templates/letter-pro.typ',
    );
    expect(joinPublicUrl('/letter_writer/', 'typst-packages/local/letter-pro/3.0.0/lib.typ')).toBe(
      '/letter_writer/typst-packages/local/letter-pro/3.0.0/lib.typ',
    );
  });

  it('leaves root deployment paths unchanged', () => {
    expect(joinPublicUrl('/', '/templates/catalog.json')).toBe('/templates/catalog.json');
  });

  it('uses the configured Vite base URL', () => {
    expect(publicUrl('/templates/catalog.json')).toBe('/templates/catalog.json');
  });
});
