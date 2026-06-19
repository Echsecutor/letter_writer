import { useCallback, useEffect, useState } from 'react';
import type { FormValues } from '../domain/letter/types';

const STORAGE_KEY = 'letter-writer-draft';

export interface DraftState {
  templateId: string;
  values: FormValues;
}

function readDraft(templateId: string): FormValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as DraftState;
    if (parsed.templateId !== templateId) {
      return {};
    }
    return parsed.values;
  } catch {
    return {};
  }
}

export function useDraftPersistence(templateId: string) {
  const [values, setValues] = useState<FormValues>(() => readDraft(templateId));

  useEffect(() => {
    const draft: DraftState = { templateId, values };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [templateId, values]);

  const setField = useCallback((fieldId: string, value: string) => {
    setValues((current) => ({ ...current, [fieldId]: value }));
  }, []);

  const resetForTemplate = useCallback((nextTemplateId: string) => {
    setValues(readDraft(nextTemplateId));
  }, []);

  return { values, setField, resetForTemplate };
}
