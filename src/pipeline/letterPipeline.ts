import { buildContext } from '../domain/letter/buildContext';
import { plainTextToTypst } from '../domain/letter/plainTextToTypst';
import type { LetterInput, LetterOutput } from '../domain/letter/types';
import { loadTemplate } from '@/domain/templates/loadTemplate';
import { assembleDocument } from './stages/assembleDocument';
import { compileTypst, type TypstCompiler } from './stages/compileTypst';
import { fillTemplate } from './stages/fillTemplate';

export interface LetterPipelineOptions {
  typstCompiler: TypstCompiler;
}

export async function runLetterPipeline(
  input: LetterInput,
  options: LetterPipelineOptions,
): Promise<LetterOutput> {
  const template = await loadTemplate(input.templateId);
  const context = buildContext({ values: input.values, schema: template.schema });
  const { filledShell } = fillTemplate({ shell: template.shell, context });

  const bodyTypst =
    input.bodyMode === 'plain'
      ? plainTextToTypst(context.Anschreiben)
      : plainTextToTypst(context.Anschreiben);

  const { mainContent } = assembleDocument({ filledShell, bodyTypst });
  const compile = await compileTypst({ mainContent }, options.typstCompiler);

  return { filledShell, mainContent, compile };
}
