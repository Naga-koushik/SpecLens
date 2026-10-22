export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmGenerateInput {
  messages: LlmMessage[];
  maxOutputTokens: number;
  temperature?: number;
}

export interface LlmHealth {
  provider: string;
  model: string;
  reachable: boolean;
  modelAvailable: boolean;
  generationAvailable: boolean;
  message?: string;
}

export interface LlmProvider {
  readonly name: string;
  readonly model: string;
  generate(input: LlmGenerateInput): Promise<string>;
  stream(input: LlmGenerateInput): AsyncIterable<string>;
  health(): Promise<LlmHealth>;
}
