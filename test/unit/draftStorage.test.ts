import { describe, expect, it } from 'vitest';
import {
  readDraftFromStorage,
  switchTemplatePreservingValues,
} from '@/domain/letter/draftStorage';

describe('draftStorage', () => {
  it('migrates legacy template id on read', () => {
    const draft = readDraftFromStorage(
      JSON.stringify({
        templateId: 'letter',
        values: { Betreff: 'Test' },
        bodyMode: 'markdown',
      }),
    );

    expect(draft.templateId).toBe('letter-pro');
    expect(draft.values.Betreff).toBe('Test');
    expect(draft.bodyMode).toBe('markdown');
  });

  it('keeps form values when switching templates', () => {
    const initial = readDraftFromStorage(
      JSON.stringify({
        templateId: 'letter-pro',
        values: { Betreff: 'Unverändert', Anschreiben: 'Text' },
        bodyMode: 'plain',
      }),
    );

    const switched = switchTemplatePreservingValues(initial, 'briefs');

    expect(switched.templateId).toBe('briefs');
    expect(switched.values).toEqual(initial.values);
    expect(switched.bodyMode).toBe('plain');
  });
});
