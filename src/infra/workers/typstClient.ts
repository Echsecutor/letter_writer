import type { CompileResult } from '../../domain/letter/types';
import type { CompileTypstInput, TypstCompiler } from '../../pipeline/stages/compileTypst';
import {
  createRequestId,
  isWorkerErrorResponse,
  type TypstCompileBothResponse,
  type TypstResponse,
} from './workerProtocol';

type PendingRequest = {
  resolve: (response: TypstResponse) => void;
  reject: (error: Error) => void;
};

let worker: Worker | null = null;
let initPromise: Promise<void> | null = null;
const pending = new Map<string, PendingRequest>();

function rejectAllPending(message: string): void {
  for (const [id, request] of pending.entries()) {
    pending.delete(id);
    request.reject(new Error(message));
  }
}

function getWorker(): Worker {
  worker ??= new Worker(new URL('./typst.worker.ts', import.meta.url), { type: 'module' });
  worker.onerror = (event: ErrorEvent) => {
    rejectAllPending(event.message || 'Typst worker failed to start');
  };
  worker.onmessageerror = () => {
    rejectAllPending('Typst worker returned an invalid message');
  };
  worker.onmessage = (event: MessageEvent<TypstResponse>) => {
    const response = event.data;
    const request = pending.get(response.id);
    if (!request) {
      return;
    }
    pending.delete(response.id);
    if (isWorkerErrorResponse(response)) {
      request.reject(new Error(response.message));
      return;
    }
    request.resolve(response);
  };
  return worker;
}

function sendRequest(payload: {
  type: string;
  format?: 'svg' | 'pdf' | 'both';
  source?: string;
  shadowFiles?: CompileTypstInput['shadowFiles'];
}): Promise<TypstResponse> {
  const id = createRequestId();
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ ...payload, id });
  });
}

async function ensureInitialized(): Promise<void> {
  initPromise ??= sendRequest({ type: 'typst:init' }).then(() => undefined);
  await initPromise;
}

function assertBothResponse(response: TypstResponse): TypstCompileBothResponse {
  if (isWorkerErrorResponse(response)) {
    throw new Error(response.message);
  }
  if (response.type !== 'typst:compile' || response.format !== 'both') {
    throw new Error('Unexpected typst worker response');
  }
  return response;
}

export const workerTypstCompiler: TypstCompiler = {
  async compile(input: CompileTypstInput): Promise<CompileResult> {
    await ensureInitialized();
    const response = assertBothResponse(
      await sendRequest({
        type: 'typst:compile',
        format: 'both',
        source: input.mainContent,
        shadowFiles: input.shadowFiles,
      }),
    );

    return {
      svg: response.svg,
      pdf: response.pdf,
    };
  },
};
