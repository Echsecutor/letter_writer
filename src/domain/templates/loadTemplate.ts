import type { LoadedTemplate, LetterSchema } from './schemaTypes';

export function loadTemplate(templateId: string): Promise<LoadedTemplate> {
  return Promise.all([
    fetch(`/templates/${templateId}.typ`),
    fetch(`/templates/${templateId}.schema.json`),
  ]).then(async ([shellRes, schemaRes]) => {
    if (!shellRes.ok || !schemaRes.ok) {
      throw new Error(`Failed to load template "${templateId}"`);
    }

    const [shell, schemaRaw] = await Promise.all([shellRes.text(), schemaRes.text()]);
    return {
      id: templateId,
      shell,
      schema: JSON.parse(schemaRaw) as LetterSchema,
    };
  });
}
