import type {
  TypstRequest,
  TypstResponse,
  WorkerErrorResponse,
} from './workerProtocol';
import { configureAppRoot } from '../appUrl';
import {
  compileTypstInWorkerRuntime,
  initTypstWorkerRuntime,
} from '../typst/workerRuntime';

function errorResponse(id: string, message: string): WorkerErrorResponse {
  return { type: 'error', id, message };
}

async function handleTypstRequest(request: TypstRequest): Promise<TypstResponse | WorkerErrorResponse> {
  switch (request.type) {
    case 'typst:init':
      configureAppRoot(request.appRootUrl);
      await initTypstWorkerRuntime();
      return { type: 'typst:init', id: request.id, ok: true };
    case 'typst:compile': {
      const result = await compileTypstInWorkerRuntime(request.source, request.shadowFiles);
      if (request.format === 'svg') {
        return { type: 'typst:compile', id: request.id, format: 'svg', svg: result.svg };
      }
      if (request.format === 'pdf') {
        return { type: 'typst:compile', id: request.id, format: 'pdf', pdf: result.pdf };
      }
      return {
        type: 'typst:compile',
        id: request.id,
        format: 'both',
        svg: result.svg,
        pdf: result.pdf,
      };
    }
    default: {
      const _exhaustive: never = request;
      return errorResponse(
        (_exhaustive as TypstRequest).id,
        'Unknown typst request',
      );
    }
  }
}

self.onmessage = (event: MessageEvent<TypstRequest>) => {
  void (async () => {
    try {
      const response = await handleTypstRequest(event.data);
      self.postMessage(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown worker error';
      self.postMessage(errorResponse(event.data.id, message));
    }
  })();
};

export {};