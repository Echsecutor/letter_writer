import type {
  PandocRequest,
  PandocResponse,
  WorkerErrorResponse,
} from './workerProtocol';

function errorResponse(id: string, message: string): WorkerErrorResponse {
  return { type: 'error', id, message };
}

function handlePandocRequest(
  request: PandocRequest,
): PandocResponse | WorkerErrorResponse {
  switch (request.type) {
    case 'pandoc:init':
      return { type: 'pandoc:init', id: request.id, ok: true };
    case 'pandoc:convert':
      return errorResponse(request.id, 'Not implemented (Phase 2): pandoc convert');
    default: {
      const _exhaustive: never = request;
      return errorResponse(
        (_exhaustive as PandocRequest).id,
        'Unknown pandoc request',
      );
    }
  }
}

self.onmessage = (event: MessageEvent<PandocRequest>) => {
  try {
    const response = handlePandocRequest(event.data);
    self.postMessage(response);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown worker error';
    self.postMessage(errorResponse(event.data.id, message));
  }
};

export {};
