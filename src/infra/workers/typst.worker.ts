import type {
  TypstRequest,
  TypstResponse,
  WorkerErrorResponse,
} from './workerProtocol';

function errorResponse(id: string, message: string): WorkerErrorResponse {
  return { type: 'error', id, message };
}

function handleTypstRequest(request: TypstRequest): TypstResponse | WorkerErrorResponse {
  switch (request.type) {
    case 'typst:init':
      return { type: 'typst:init', id: request.id, ok: true };
    case 'typst:compile':
      return errorResponse(request.id, 'Not implemented (Phase 1): typst compile');
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
  try {
    const response = handleTypstRequest(event.data);
    self.postMessage(response);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown worker error';
    self.postMessage(errorResponse(event.data.id, message));
  }
};

export {};
