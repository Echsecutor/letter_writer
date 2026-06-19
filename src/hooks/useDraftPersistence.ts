import { useCallback, useEffect, useState } from 'react';
import type { BodyMode } from '../domain/letter/types';
import {
  draftStorageKey,
  readDraftFromStorage,
  serializeDraft,
  switchTemplatePreservingValues,
  type DraftState,
} from '../domain/letter/draftStorage';

export function useDraftPersistence() {
  const [draft, setDraft] = useState<DraftState>(() =>
    readDraftFromStorage(localStorage.getItem(draftStorageKey())),
  );

  useEffect(() => {
    localStorage.setItem(draftStorageKey(), serializeDraft(draft));
  }, [draft]);

  const setTemplateId = useCallback((templateId: string) => {
    setDraft((current) => switchTemplatePreservingValues(current, templateId));
  }, []);

  const setField = useCallback((fieldId: string, value: string) => {
    setDraft((current) => ({
      ...current,
      values: { ...current.values, [fieldId]: value },
    }));
  }, []);

  const setBodyMode = useCallback((bodyMode: BodyMode) => {
    setDraft((current) => ({ ...current, bodyMode }));
  }, []);

  return {
    templateId: draft.templateId,
    values: draft.values,
    bodyMode: draft.bodyMode,
    setTemplateId,
    setField,
    setBodyMode,
  };
}
