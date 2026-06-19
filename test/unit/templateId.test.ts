import { describe, expect, it } from 'vitest';
import { normalizeTemplateId } from '@/domain/letter/types';

describe('normalizeTemplateId', () => {
  it('migrates legacy letter id to letter-pro', () => {
    expect(normalizeTemplateId('letter')).toBe('letter-pro');
    expect(normalizeTemplateId('letter-pro')).toBe('letter-pro');
  });
});
