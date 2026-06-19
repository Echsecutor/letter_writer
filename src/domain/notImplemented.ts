/** Thrown by Phase 0 stubs until the corresponding stage is implemented. */
export class NotImplementedError extends Error {
  constructor(phase: string, module: string) {
    super(`Not implemented (${phase}): ${module}`);
    this.name = 'NotImplementedError';
  }
}

export const PHASE_1 = 'Phase 1';
export const PHASE_2 = 'Phase 2';
