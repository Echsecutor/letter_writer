/** Shared request/response types for typst and pandoc Web Workers. */

export interface WorkerErrorResponse {
  type: 'error';
  id: string;
  message: string;
}

// --- Typst worker ---

export interface TypstInitRequest {
  type: 'typst:init';
  id: string;
}

export interface TypstInitResponse {
  type: 'typst:init';
  id: string;
  ok: true;
}

export interface TypstCompileRequest {
  type: 'typst:compile';
  id: string;
  source: string;
  format: 'svg' | 'pdf';
}

export interface TypstCompileSvgResponse {
  type: 'typst:compile';
  id: string;
  format: 'svg';
  svg: string;
}

export interface TypstCompilePdfResponse {
  type: 'typst:compile';
  id: string;
  format: 'pdf';
  pdf: Uint8Array;
}

export type TypstCompileResponse = TypstCompileSvgResponse | TypstCompilePdfResponse;

export type TypstRequest = TypstInitRequest | TypstCompileRequest;
export type TypstResponse = TypstInitResponse | TypstCompileResponse | WorkerErrorResponse;

// --- Pandoc worker ---

export interface PandocInitRequest {
  type: 'pandoc:init';
  id: string;
}

export interface PandocInitResponse {
  type: 'pandoc:init';
  id: string;
  ok: true;
}

export interface PandocConvertRequest {
  type: 'pandoc:convert';
  id: string;
  markdown: string;
}

export interface PandocConvertResponse {
  type: 'pandoc:convert';
  id: string;
  bodyTypst: string;
}

export type PandocRequest = PandocInitRequest | PandocConvertRequest;
export type PandocResponse = PandocInitResponse | PandocConvertResponse | WorkerErrorResponse;

export type WorkerRequest = TypstRequest | PandocRequest;
export type WorkerResponse = TypstResponse | PandocResponse;

export function isWorkerErrorResponse(
  response: WorkerResponse,
): response is WorkerErrorResponse {
  return response.type === 'error';
}

export function createRequestId(): string {
  return crypto.randomUUID();
}
