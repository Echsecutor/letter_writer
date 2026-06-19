import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { convertBody } from '@/pipeline/stages/convertBody';
import { fixturePath } from '../helpers/paths';

describe('convertBody (Phase 2)', () => {
  it('converts markdown body to typst fragment', async () => {
    const markdown = readFileSync(fixturePath('sample-body.md'), 'utf8');

    const { bodyTypst } = await convertBody({ body: markdown, mode: 'markdown' });

    expect(bodyTypst).toContain('Sehr geehrte');
    expect(bodyTypst).toMatch(/bold|strong|\*\*/i);
  });
});
