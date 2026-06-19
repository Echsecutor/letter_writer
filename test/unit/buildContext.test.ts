import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildContext } from '@/domain/letter/buildContext';
import type { LetterSchema } from '@/domain/templates/schemaTypes';
import formValues from '../fixtures/sample-form-values.json';
import { templatePath } from '../helpers/paths';

describe('buildContext', () => {
  it('maps form values to LetterContext with defaults and Empfaenger_typst', () => {
    const schema = JSON.parse(
      readFileSync(templatePath('letter.schema.json'), 'utf8'),
    ) as LetterSchema;

    const context = buildContext({ values: formValues, schema });

    expect(context.Empfaenger_typst).toContain('Firma Beispiel GmbH');
    expect(context.reference_signs).toEqual([]);
    expect(context.today_de).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });
});
