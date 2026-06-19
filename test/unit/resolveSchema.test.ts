import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolveLetterSchema } from '@/domain/templates/resolveSchema';
import type { LetterSchema } from '@/domain/templates/schemaTypes';
import { templatePath } from '../helpers/paths';

describe('resolveLetterSchema', () => {
  it('merges shared schema fields into template wrappers', async () => {
    const shared = JSON.parse(
      readFileSync(templatePath('shared.schema.json'), 'utf8'),
    ) as LetterSchema;
    const wrapper = JSON.parse(
      readFileSync(templatePath('letter-pro.schema.json'), 'utf8'),
    ) as LetterSchema;

    const resolved = await resolveLetterSchema(wrapper, {
      readJson: (path) => {
        if (path === 'shared.schema.json') {
          return Promise.resolve(shared);
        }
        return Promise.reject(new Error(`Unexpected schema path: ${path}`));
      },
    });

    expect(resolved.id).toBe('letter-pro');
    expect(resolved.fields.map((field) => field.id)).toEqual(shared.fields.map((field) => field.id));
  });
});
