import { createConverterFactory } from '../../pipeline/bodyConverters/createConverterFactory';
import type { BodyConverterFactory } from '../../pipeline/bodyConverters/types';
import {
  createRequestId,
  isWorkerErrorResponse,
  type PandocConvertResponse,
  type PandocResponse,
} from './workerProtocol';

type PendingRequest = {
  resolve: (response: PandocResponse) => void;
  reject: (error: Error) => void;
};

let worker: Worker | null = null;
let initPromise: Promise<void> | null = null;
const pending = new Map<string, PendingRequest>();

function getWorker(): Worker {
  worker ??= new Worker(new URL('./pandoc.worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (event: MessageEvent<PandocResponse>) => {
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

function sendRequest(payload: { type: string; markdown?: string }): Promise<PandocResponse> {
  const id = createRequestId();
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ ...payload, id });
  });
}

async function ensureInitialized(): Promise<void> {
  initPromise ??= sendRequest({ type: 'pandoc:init' }).then(() => undefined);
  await initPromise;
}

function assertConvertResponse(response: PandocResponse): PandocConvertResponse {
  if (isWorkerErrorResponse(response)) {
    throw new Error(response.message);
  }
  if (response.type !== 'pandoc:convert') {
    throw new Error('Unexpected pandoc worker response');
  }
  return response;
}

async function convertMarkdownInWorker(markdown: string): Promise<string> {
  await ensureInitialized();
  const response = assertConvertResponse(
    await sendRequest({ type: 'pandoc:convert', markdown }),
  );
  return response.bodyTypst;
}

export const workerPandocConverterFactory: BodyConverterFactory =
  createConverterFactory(convertMarkdownInWorker);
