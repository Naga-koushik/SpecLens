import { LlmGenerateInput, LlmHealth, LlmProvider } from './types.js';

export class MockLlmProvider implements LlmProvider {
  public readonly name = 'mock';
  public readonly model = 'offline-demo';

  async generate(input: LlmGenerateInput): Promise<string> {
    const context = input.messages.find((message) => message.role === 'system')?.content ?? '';
    const battery = context.match(/battery:\s*([^\n]+)/i)?.[1] ?? 'not available';
    const display = context.match(/display:\s*([^\n]+)/i)?.[1] ?? 'not available';
    return `AI demo answer: Based only on the listed specifications, the relevant details are battery ${battery} and display ${display}. This is an estimate rather than a measured result; real use varies with brightness, network, apps and settings. Specs used: battery, display.`;
  }

  async *stream(input: LlmGenerateInput): AsyncIterable<string> {
    const text = await this.generate(input);
    for (const chunk of text.match(/.{1,48}/g) ?? []) yield chunk;
  }

  async health(): Promise<LlmHealth> {
    return {
      provider: this.name,
      model: this.model,
      reachable: true,
      modelAvailable: true,
      generationAvailable: true,
      message: 'Using the deterministic offline assistant.'
    };
  }
}
