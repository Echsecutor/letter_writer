import { convertMarkdownBody } from '../pandoc/pandocWasm';
import type {
  PandocRequest,
  PandocResponse,
  WorkerErrorResponse,
} from './workerProtocol';

function errorResponse(id: string, message: string): WorkerErrorResponse {
  return { type: 'error', id, message };
}

async function handlePandocRequest(
  request: PandocRequest,
): Promise<PandocResponse | WorkerErrorResponse> {
  switch (request.type) {
    case 'pandoc:init':
      return { type: 'pandoc:init', id: request.id, ok: true };
    case 'pandoc:convert': {
      const bodyTypst = await convertMarkdownBody(request.markdown);
      return {
        type: 'pandoc:convert',
        id: request.id,
        bodyTypst,
      };
    }
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
  void (async () => {
    try {
      const response = await handlePandocRequest(event.data);
      self.postMessage(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown worker error';
      self.postMessage(errorResponse(event.data.id, message));
    }
  })();
};

export {};
