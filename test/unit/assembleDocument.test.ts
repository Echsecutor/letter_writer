import { describe, expect, it } from 'vitest';
import {
  BODY_INJECT_MARKER,
  assembleDocument,
} from '@/pipeline/stages/assembleDocument';

describe('assembleDocument', () => {
  it('injects body at marker and removes BODY_INJECT marker', () => {
    const filledShell = `#show: letter\n${BODY_INJECT_MARKER}`;
    const bodyTypst = '#par[Hello world]';

    const { mainContent } = assembleDocument({ filledShell, bodyTypst });

    expect(mainContent).toContain(bodyTypst);
    expect(mainContent).not.toContain(BODY_INJECT_MARKER);
  });
});
