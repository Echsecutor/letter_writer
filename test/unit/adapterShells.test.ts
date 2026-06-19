import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fillTemplate } from '@/pipeline/stages/fillTemplate';
import { buildContext } from '@/domain/letter/buildContext';
import type { LetterSchema } from '@/domain/templates/schemaTypes';
import formValues from '../fixtures/sample-form-values.json';
import { templatePath } from '../helpers/paths';

const ADAPTER_IDS = ['letter-pro', 'briefs', 'pc-letter'] as const;

describe('adapter shells', () => {
  const schema = JSON.parse(
    readFileSync(templatePath('shared.schema.json'), 'utf8'),
  ) as LetterSchema;
  const context = buildContext({ values: formValues, schema });

  it.each(ADAPTER_IDS)('fills %s shell without leftover Nunjucks markers', (templateId) => {
    const shell = readFileSync(templatePath(`${templateId}.typ`), 'utf8');
    const { filledShell } = fillTemplate({ shell, context });

    expect(filledShell).not.toMatch(/\{\{|\{%/);
    expect(filledShell).toContain('/* BODY_INJECT */');
    expect(filledShell).toContain(formValues.Betreff);
  });
});
