import type { LoadedTemplate, LetterSchema } from './schemaTypes';
import { resolveLetterSchema } from './resolveSchema';
import { publicUrl } from '@/infra/publicUrl';

export function loadTemplate(templateId: string): Promise<LoadedTemplate> {
  const schemaSource = {
    readJson: async (relativePath: string) => {
      const response = await fetch(publicUrl(`/templates/${relativePath}`));
      if (!response.ok) {
        throw new Error(`Failed to load schema "${relativePath}"`);
      }
      return response.json() as Promise<unknown>;
    },
  };

  return Promise.all([
    fetch(publicUrl(`/templates/${templateId}.typ`)),
    fetch(publicUrl(`/templates/${templateId}.schema.json`)),
  ]).then(async ([shellRes, schemaRes]) => {
    if (!shellRes.ok || !schemaRes.ok) {
      throw new Error(`Failed to load template "${templateId}"`);
    }

    const [shell, schemaRaw] = await Promise.all([
      shellRes.text(),
      schemaRes.json() as Promise<LetterSchema>,
    ]);
    const schema = await resolveLetterSchema(schemaRaw, schemaSource);

    return {
      id: templateId,
      shell,
      schema,
    };
  });
}
