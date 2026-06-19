import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  buildContext,
  parseReferenceSigns,
} from '@/domain/letter/buildContext';
import type { LetterSchema } from '@/domain/templates/schemaTypes';
import formValues from '../fixtures/sample-form-values.json';
import { templatePath } from '../helpers/paths';

describe('buildContext', () => {
  const schema = JSON.parse(
    readFileSync(templatePath('shared.schema.json'), 'utf8'),
  ) as LetterSchema;

  it('maps form values to LetterContext with defaults and Empfaenger_typst', () => {
    const context = buildContext({ values: formValues, schema });

    expect(context.Empfaenger_typst).toContain('Firma Beispiel GmbH');
    expect(context.reference_signs).toEqual([]);
    expect(context.today_de).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    expect(context.Ort).toBe('Hürth');
  });

  it('builds multi-library address helpers', () => {
    const context = buildContext({ values: formValues, schema });

    expect(context.Absender_sender_lines).toEqual([
      'Max Mustermann',
      'Berrenrather Str. 150',
      '50354 Hürth',
    ]);
    expect(context.Absender_Adresse_typst_array).toBe(
      '"Berrenrather Str. 150", "50354 Hürth"',
    );
    expect(context.Datum_datetime_typst).toBe('datetime(day: 19, month: 6, year: 2026)');
  });

  it('maps reference signs for template adapters', () => {
    const context = buildContext({
      values: {
        ...formValues,
        reference_signs: JSON.stringify([
          { label: 'Ihr Zeichen', value: 'ABC-1' },
          { label: 'Unser Zeichen', value: 'XYZ-9' },
        ]),
      },
      schema,
    });

    expect(context.reference_signs).toEqual([
      { label: 'Ihr Zeichen', value: 'ABC-1' },
      { label: 'Unser Zeichen', value: 'XYZ-9' },
    ]);
    expect(context.briefs_information_extra_typst).toContain('Ihr Zeichen: ABC-1');
    expect(context.pc_letter_reference_typst).toBe('Ihr Zeichen: ABC-1');
  });
});

describe('parseReferenceSigns', () => {
  it('returns empty array for invalid input', () => {
    expect(parseReferenceSigns(undefined)).toEqual([]);
    expect(parseReferenceSigns('not-json')).toEqual([]);
  });
});
