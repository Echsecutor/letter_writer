import { describe, expect, it } from 'vitest';
import { configureAppRoot, resolveAppPath } from '@/infra/appUrl';

describe('appUrl', () => {
  it('resolves paths relative to the app root', () => {
    expect(resolveAppPath('templates/catalog.json', 'https://example.com/letter_writer/')).toBe(
      'https://example.com/letter_writer/templates/catalog.json',
    );
    expect(
      resolveAppPath('/templates/letter-pro.typ', 'https://example.com/letter_writer/'),
    ).toBe('https://example.com/letter_writer/templates/letter-pro.typ');
    expect(
      resolveAppPath('typst-packages/local/letter-pro/3.0.0/lib.typ', 'https://example.com/'),
    ).toBe('https://example.com/typst-packages/local/letter-pro/3.0.0/lib.typ');
  });

  it('uses configured app root in workers', () => {
    configureAppRoot('https://example.com/letter_writer/');
    expect(resolveAppPath('typst-packages/local/briefs/0.3.0/lib.typ')).toBe(
      'https://example.com/letter_writer/typst-packages/local/briefs/0.3.0/lib.typ',
    );
  });
});
