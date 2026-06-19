import nunjucks from 'nunjucks';

const env = nunjucks.configure({ autoescape: false, throwOnUndefined: false });

export interface RenderTemplateInput {
  shell: string;
  context: Record<string, unknown>;
}

export function renderTemplate(input: RenderTemplateInput): string {
  return env.renderString(input.shell, input.context);
}
