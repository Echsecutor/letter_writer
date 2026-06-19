import type { BodyMode, FormValues } from './types';
import { DEFAULT_TEMPLATE_ID, normalizeTemplateId } from './types';

const STORAGE_KEY = 'letter-writer-draft';

export interface DraftState {
  templateId: string;
  values: FormValues;
  bodyMode: BodyMode;
}

export function emptyDraft(): DraftState {
  return { templateId: DEFAULT_TEMPLATE_ID, values: {}, bodyMode: 'plain' };
}

export function readDraftFromStorage(raw: string | null): DraftState {
  if (!raw) {
    return emptyDraft();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DraftState>;
    return {
      templateId: normalizeTemplateId(parsed.templateId ?? DEFAULT_TEMPLATE_ID),
      values: parsed.values ?? {},
      bodyMode: parsed.bodyMode === 'markdown' ? 'markdown' : 'plain',
    };
  } catch {
    return emptyDraft();
  }
}

export function serializeDraft(draft: DraftState): string {
  return JSON.stringify(draft);
}

export function switchTemplatePreservingValues(
  draft: DraftState,
  nextTemplateId: string,
): DraftState {
  return {
    ...draft,
    templateId: normalizeTemplateId(nextTemplateId),
  };
}

export function draftStorageKey(): string {
  return STORAGE_KEY;
}
