import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { nodePandocConverterFactory } from '@/infra/pandoc/nodePandocConverter';
import { fixturePath } from '../helpers/paths';

describe('nodePandocConverterFactory', () => {
  it('converts sample-body.md to typst fragment matching snapshot', async () => {
    const markdown = readFileSync(fixturePath('sample-body.md'), 'utf8');
    const expected = readFileSync(fixturePath('expected-body.typ'), 'utf8');
    const converter = await nodePandocConverterFactory.create();

    const bodyTypst = await converter.convert(markdown);

    expect(bodyTypst).toBe(expected);
  });
});
