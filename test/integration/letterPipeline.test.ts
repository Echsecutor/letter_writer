import { describe, expect, it } from 'vitest';
import { runLetterPipeline } from '@/pipeline/letterPipeline';
import { nodeTypstCompiler } from '@/infra/typst/nodeCompiler';
import formValues from '../fixtures/sample-form-values.json';

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
});
