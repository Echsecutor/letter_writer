import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { plainTextToTypst } from '@/domain/letter/plainTextToTypst';
import type { BodyConverter } from '@/pipeline/bodyConverters/types';
import { convertBody } from '@/pipeline/stages/convertBody';
import { fixturePath } from '../helpers/paths';

describe('convertBody', () => {
  it('converts plain text body via plainTextToTypst', async () => {
    const body = 'Sehr geehrte Damen und Herren,\n\nMit freundlichen Grüßen';

    const { bodyTypst } = await convertBody({ body, mode: 'plain' });

    expect(bodyTypst).toBe(plainTextToTypst(body));
  });

  it('returns empty typst for blank markdown body', async () => {
    const { bodyTypst } = await convertBody({ body: '   \n', mode: 'markdown' });

    expect(bodyTypst).toBe('');
  });

  it('requires a converter for markdown mode', async () => {
    await expect(convertBody({ body: '**bold**', mode: 'markdown' })).rejects.toThrow(
      'Markdown body conversion requires a BodyConverter',
    );
  });

  it('converts markdown body via injected converter', async () => {
    const markdown = readFileSync(fixturePath('sample-body.md'), 'utf8');
    const expected = readFileSync(fixturePath('expected-body.typ'), 'utf8');
    const converter: BodyConverter = {
      convert: () => Promise.resolve(expected),
    };

    const { bodyTypst } = await convertBody({ body: markdown, mode: 'markdown' }, { converter });

    expect(bodyTypst).toContain('Sehr geehrte');
    expect(bodyTypst).toMatch(/#strong\[/);
    expect(bodyTypst).toContain('- Punkt eins');
  });
});
