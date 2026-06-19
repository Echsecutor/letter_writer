import { useEffect, useMemo, useRef, useState } from 'react';
import type { LetterInput, LetterOutput } from '../domain/letter/types';
import { workerPandocConverterFactory } from '../infra/workers/pandocClient';
import { workerTypstCompiler } from '../infra/workers/typstClient';
import { runLetterPipeline } from '../pipeline/letterPipeline';

const DEBOUNCE_MS = 300;

export interface UseLetterPipelineResult {
  output: LetterOutput | null;
  loading: boolean;
  error: string | null;
}

function stableInputKey(input: LetterInput | null): string {
  if (!input) {
    return '';
  }
  return JSON.stringify(input);
}

export function useLetterPipeline(input: LetterInput | null): UseLetterPipelineResult {
  const [output, setOutput] = useState<LetterOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedKey, setResolvedKey] = useState('');
  const inputKey = useMemo(() => stableInputKey(input), [input]);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!input) {
      return;
    }

    const requestId = ++requestIdRef.current;

    const timer = window.setTimeout(() => {
      setLoading(true);
      setError(null);

      void runLetterPipeline(input, {
        typstCompiler: workerTypstCompiler,
        markdownConverter: workerPandocConverterFactory,
      })
        .then((result) => {
          if (requestIdRef.current !== requestId) {
            return;
          }
          setOutput(result);
          setError(null);
          setResolvedKey(inputKey);
        })
        .catch((pipelineError: unknown) => {
          if (requestIdRef.current !== requestId) {
            return;
          }
          setOutput(null);
          setError(pipelineError instanceof Error ? pipelineError.message : 'Pipeline failed');
          setResolvedKey(inputKey);
        })
        .finally(() => {
          if (requestIdRef.current === requestId) {
            setLoading(false);
          }
        });
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [input, inputKey]);

  const isPending = Boolean(input) && inputKey !== resolvedKey;
  const visibleOutput = input && resolvedKey === inputKey ? output : null;

  return {
    output: visibleOutput,
    loading: loading || isPending,
    error: input ? error : null,
  };
}
