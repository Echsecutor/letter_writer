import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { nodePandocConverterFactory } from '@/infra/pandoc/nodePandocConverter';
import { nodeTypstCompiler } from '@/infra/typst/nodeCompiler';
import { runLetterPipeline } from '@/pipeline/letterPipeline';
import formValues from '../fixtures/sample-form-values.json';
import legacyFields from '../fixtures/legacy-letter-md-fields.json';
import { fixturePath } from '../helpers/paths';
import { pdfContainsAllText } from '../helpers/pdfText';

describe('letterPipeline integration', () => {
  it('produces a valid PDF from fixture form values (plain body)', async () => {
    const output = await runLetterPipeline(
      {
        templateId: 'letter',
        values: formValues,
        bodyMode: 'plain',
      },
      { typstCompiler: nodeTypstCompiler },
    );

    expect(output.mainContent).not.toContain('/* BODY_INJECT */');
    expect(output.compile.pdf.byteLength).toBeGreaterThan(1000);
    expect(String.fromCharCode(...output.compile.pdf.slice(0, 4))).toBe('%PDF');
  });

  it('produces a valid PDF with markdown body via pandoc converter', async () => {
    const markdownBody = readFileSync(fixturePath('sample-body.md'), 'utf8');
    const output = await runLetterPipeline(
      {
        templateId: 'letter',
        values: { ...formValues, Anschreiben: markdownBody },
        bodyMode: 'markdown',
      },
      {
        typstCompiler: nodeTypstCompiler,
        markdownConverter: nodePandocConverterFactory,
      },
    );

    expect(output.mainContent).not.toContain('/* BODY_INJECT */');
    expect(output.mainContent).toContain('#strong[Ihr Angebot]');
    expect(output.compile.pdf.byteLength).toBeGreaterThan(1000);
    expect(String.fromCharCode(...output.compile.pdf.slice(0, 4))).toBe('%PDF');
  });

  it('legacy letter.md field values survive migration to Typst PDF', async () => {
    const output = await runLetterPipeline(
      {
        templateId: 'letter',
        values: {
          Absender_Name: legacyFields.Absender_Name,
          Absender_Adresse: legacyFields.Rueckadresse,
          Empfaenger: legacyFields.Empfaenger,
          Betreff: legacyFields.Betreff,
          Anschreiben: legacyFields.Anschreiben,
        },
        bodyMode: 'plain',
      },
      { typstCompiler: nodeTypstCompiler },
    );

    expect(output.mainContent).toContain('Firma Beispiel GmbH');

    const { pdf } = output.compile;
    expect(pdfContainsAllText(pdf, ['Anfrage', 'Projekt X', legacyFields.Absender_Name])).toBe(
      true,
    );
  });
});
