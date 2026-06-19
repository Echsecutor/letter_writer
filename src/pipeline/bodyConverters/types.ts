export interface BodyConverter {
  convert(markdown: string): Promise<string>;
}

export interface BodyConverterFactory {
  create(): Promise<BodyConverter>;
}
