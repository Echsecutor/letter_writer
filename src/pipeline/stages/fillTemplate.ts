import type { LetterContext } from '../../domain/letter/types';
import { renderTemplate } from '../../domain/templates/nunjucksEngine';

export interface FillTemplateInput {
  shell: string;
  context: LetterContext;
}

export interface FillTemplateOutput {
  filledShell: string;
}

export function fillTemplate(input: FillTemplateInput): FillTemplateOutput {
  return {
    filledShell: renderTemplate({ shell: input.shell, context: input.context }),
  };
}
