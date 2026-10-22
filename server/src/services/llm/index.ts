import { env } from '../../config/env.js';
import { HttpLlmProvider } from './httpProvider.js';
import { MockLlmProvider } from './mockProvider.js';
import { LlmProvider } from './types.js';

export function createLlmProvider(): LlmProvider {
  if (env.AI_PROVIDER === 'mock') return new MockLlmProvider();
  const defaultBaseUrls: Record<string, string> = {
    ollama: 'http://127.0.0.1:11434/v1',
    anthropic: 'https://api.anthropic.com/v1',
    gemini: 'https://generativelanguage.googleapis.com/v1beta/openai',
    'openai-compatible': 'http://127.0.0.1:1234/v1'
  };
  return new HttpLlmProvider(env.AI_PROVIDER, env.LLM_BASE_URL || defaultBaseUrls[env.AI_PROVIDER]);
}

export const llmProvider = createLlmProvider();
export type { LlmMessage, LlmGenerateInput, LlmProvider } from './types.js';
