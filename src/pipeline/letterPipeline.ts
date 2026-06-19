import { buildContext } from '../domain/letter/buildContext';
import type { LetterInput, LetterOutput } from '../domain/letter/types';
import { loadTemplate } from '@/domain/templates/loadTemplate';
import type { BodyConverterFactory } from './bodyConverters/types';
import { assembleDocument } from './stages/assembleDocument';
import { compileTypst, type TypstCompiler } from './stages/compileTypst';
import { convertBody } from './stages/convertBody';
import { fillTemplate } from './stages/fillTemplate';

export interface LetterPipelineOptions {
  typstCompiler: TypstCompiler;
  markdownConverter?: BodyConverterFactory;
}

export async function runLetterPipeline(
  input: LetterInput,
  options: LetterPipelineOptions,
): Promise<LetterOutput> {
  const template = await loadTemplate(input.templateId);
  const context = buildContext({ values: input.values, schema: template.schema });
  const { filledShell } = fillTemplate({ shell: template.shell, context });

  let bodyConverter;
  if (input.bodyMode === 'markdown') {
    if (!options.markdownConverter) {
      throw new Error('Markdown body mode requires a markdownConverter factory');
    }
    bodyConverter = await options.markdownConverter.create();
  }

  const { bodyTypst } = await convertBody(
    { body: context.Anschreiben, mode: input.bodyMode },
    { converter: bodyConverter },
  );

  const { mainContent } = assembleDocument({ filledShell, bodyTypst });
  const compile = await compileTypst({ mainContent }, options.typstCompiler);

  return { filledShell, mainContent, compile };
}
