import { NotImplementedError, PHASE_1 } from '../notImplemented';
import { stubArg } from '../stubArg';

export interface RenderTemplateInput {
  shell: string;
  context: Record<string, unknown>;
}

export function renderTemplate(input: RenderTemplateInput): string {
  stubArg(input);
  throw new NotImplementedError(PHASE_1, 'nunjucksEngine.renderTemplate');
}
