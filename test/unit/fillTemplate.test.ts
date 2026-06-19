import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fillTemplate } from '@/pipeline/stages/fillTemplate';
import { buildContext } from '@/domain/letter/buildContext';
import type { LetterSchema } from '@/domain/templates/schemaTypes';
import formValues from '../fixtures/sample-form-values.json';
import { fixturePath, templatePath } from '../helpers/paths';

describe('fillTemplate', () => {
  it('matches expected-shell.typ snapshot', () => {
    const shell = readFileSync(templatePath('letter.typ'), 'utf8');
    const expected = readFileSync(fixturePath('expected-shell.typ'), 'utf8');
    const schema = JSON.parse(
      readFileSync(templatePath('letter.schema.json'), 'utf8'),
    ) as LetterSchema;

    const context = buildContext({ values: formValues, schema });
    const { filledShell } = fillTemplate({ shell, context });

    expect(filledShell.trim()).toBe(expected.trim());
  });
});
