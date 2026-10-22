import { AppError } from '../../middleware/errorHandler.js';
import { env } from '../../config/env.js';
import { LlmGenerateInput, LlmHealth, LlmProvider } from './types.js';

interface OpenAiResponse { choices?: Array<{ message?: { content?: string } }>; }
interface OllamaTagsResponse { models?: Array<{ name?: string }>; }

export class HttpLlmProvider implements LlmProvider {
  public readonly name: string;
  public readonly model: string;
  private readonly baseUrl: string;

  constructor(name: string, baseUrl: string) {
    this.name = name;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.model = env.AI_PROVIDER === 'ollama' ? env.OLLAMA_MODEL : env.LLM_MODEL;
  }

  async generate(input: LlmGenerateInput): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), env.AI_TIMEOUT_MS);
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(env.LLM_API_KEY ? { Authorization: `Bearer ${env.LLM_API_KEY}` } : {}) },
        body: JSON.stringify({ model: this.model, messages: input.messages, temperature: input.temperature ?? 0.2, max_tokens: input.maxOutputTokens }),
        signal: controller.signal
      });
      if (!response.ok) throw new AppError('AI_UNAVAILABLE', 'The configured AI provider is unavailable', 502);
      const data = await response.json() as OpenAiResponse;
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new AppError('AI_UNAVAILABLE', 'The configured AI provider returned no answer', 502);
      return text;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof Error && error.name === 'AbortError') throw new AppError('AI_TIMEOUT', 'The AI provider timed out', 504);
      throw new AppError('AI_UNAVAILABLE', 'The AI provider could not be reached', 502);
    } finally {
      clearTimeout(timeout);
    }
  }

  async *stream(input: LlmGenerateInput): AsyncIterable<string> {
    const text = await this.generate(input);
    for (const chunk of text.match(/.{1,48}/g) ?? []) yield chunk;
  }

  async health(): Promise<LlmHealth> {
    if (this.name !== 'ollama') {
      return { provider: this.name, model: this.model, reachable: true, modelAvailable: true, generationAvailable: true, message: 'Health checks for this provider are limited to configuration.' };
    }

    const ollamaUrl = this.baseUrl.replace(/\/v1$/, '');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Math.min(env.AI_TIMEOUT_MS, 3000));
    try {
      const tagsResponse = await fetch(`${ollamaUrl}/api/tags`, { signal: controller.signal });
      if (!tagsResponse.ok) {
        return { provider: this.name, model: this.model, reachable: true, modelAvailable: false, generationAvailable: false, message: `Ollama returned HTTP ${tagsResponse.status}.` };
      }
      const tags = await tagsResponse.json() as OllamaTagsResponse;
      const modelAvailable = tags.models?.some((model) => model.name === this.model) ?? false;
      if (!modelAvailable) {
        return { provider: this.name, model: this.model, reachable: true, modelAvailable: false, generationAvailable: false, message: `Model "${this.model}" is not installed. Run: ollama pull ${this.model}` };
      }
      const generationResponse = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: this.model, prompt: 'Reply with OK.', stream: false, options: { num_predict: 8 } }),
        signal: controller.signal
      });
      return {
        provider: this.name,
        model: this.model,
        reachable: true,
        modelAvailable: true,
        generationAvailable: generationResponse.ok,
        ...(generationResponse.ok ? {} : { message: `Ollama could not generate a response (HTTP ${generationResponse.status}).` })
      };
    } catch (error) {
      return {
        provider: this.name,
        model: this.model,
        reachable: false,
        modelAvailable: false,
        generationAvailable: false,
        message: error instanceof Error && error.name === 'AbortError' ? 'Ollama health check timed out.' : 'Ollama is not reachable.'
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
