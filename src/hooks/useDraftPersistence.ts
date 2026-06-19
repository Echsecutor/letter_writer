import { useCallback, useEffect, useState } from 'react';
import type { BodyMode, FormValues } from '../domain/letter/types';

const STORAGE_KEY = 'letter-writer-draft';

export interface DraftState {
  templateId: string;
  values: FormValues;
  bodyMode: BodyMode;
}

function readDraft(templateId: string): Pick<DraftState, 'values' | 'bodyMode'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { values: {}, bodyMode: 'plain' };
    }
    const parsed = JSON.parse(raw) as Partial<DraftState>;
    if (parsed.templateId !== templateId) {
      return { values: {}, bodyMode: 'plain' };
    }
    return {
      values: parsed.values ?? {},
      bodyMode: parsed.bodyMode === 'markdown' ? 'markdown' : 'plain',
    };
  } catch {
    return { values: {}, bodyMode: 'plain' };
  }
}

export function useDraftPersistence(templateId: string) {
  const [values, setValues] = useState<FormValues>(() => readDraft(templateId).values);
  const [bodyMode, setBodyMode] = useState<BodyMode>(() => readDraft(templateId).bodyMode);

  useEffect(() => {
    const draft: DraftState = { templateId, values, bodyMode };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [templateId, values, bodyMode]);

  const setField = useCallback((fieldId: string, value: string) => {
    setValues((current) => ({ ...current, [fieldId]: value }));
  }, []);

  const resetForTemplate = useCallback((nextTemplateId: string) => {
    const draft = readDraft(nextTemplateId);
    setValues(draft.values);
    setBodyMode(draft.bodyMode);
  }, []);

  return { values, bodyMode, setField, setBodyMode, resetForTemplate };
}
