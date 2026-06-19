export const BODY_INJECT_MARKER = '/* BODY_INJECT */';

export interface AssembleDocumentInput {
  filledShell: string;
  bodyTypst: string;
}

export interface AssembleDocumentOutput {
  mainContent: string;
}

export function assembleDocument(input: AssembleDocumentInput): AssembleDocumentOutput {
  if (!input.filledShell.includes(BODY_INJECT_MARKER)) {
    throw new Error(`Filled shell is missing ${BODY_INJECT_MARKER}`);
  }

  return {
    mainContent: input.filledShell.replace(BODY_INJECT_MARKER, input.bodyTypst),
  };
}
