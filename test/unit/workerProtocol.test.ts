import { describe, expect, it } from 'vitest';
import {
  createRequestId,
  isWorkerErrorResponse,
  type TypstInitResponse,
  type WorkerErrorResponse,
} from '@/infra/workers/workerProtocol';

describe('workerProtocol', () => {
  it('creates unique request ids', () => {
    const a = createRequestId();
    const b = createRequestId();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it('detects worker error responses', () => {
    const error: WorkerErrorResponse = { type: 'error', id: '1', message: 'fail' };
    const ok: TypstInitResponse = { type: 'typst:init', id: '1', ok: true };

    expect(isWorkerErrorResponse(error)).toBe(true);
    expect(isWorkerErrorResponse(ok)).toBe(false);
  });
});
