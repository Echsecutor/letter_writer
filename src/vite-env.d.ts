/// <reference types="vite/client" />

declare module 'pandoc-wasm' {
  export function convert(
    options: Record<string, string>,
    stdin: string,
    files: Record<string, unknown>,
  ): Promise<{ stdout: string; stderr: string }>;
}

declare module '*.worker.ts' {
  const WorkerFactory: new () => Worker;
  export default WorkerFactory;
}
