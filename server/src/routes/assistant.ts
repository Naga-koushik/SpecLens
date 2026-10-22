import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler.js';
import { assistantRateLimiter } from '../middleware/assistantRateLimiter.js';
import { mobileApiClient } from '../services/mobileApiClient.js';
import { cache } from '../services/cache.js';
import { llmProvider, LlmMessage } from '../services/llm/index.js';
import { buildAssistantContext } from '../services/assistant/contextBuilder.js';
import { buildAssistantMessages } from '../services/assistant/promptBuilder.js';
import { ASSISTANT_LANGUAGES, languageByCode } from '../services/assistant/languages.js';
import { suggestions } from '../services/assistant/suggestions.js';
import { Phone } from '../types/index.js';

const router = Router();
const historySchema = z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().max(2000) });
const chatSchema = z.object({
  phoneIds: z.array(z.string().trim().regex(/^\d{1,12}$/)).min(1).max(4),
  message: z.string().trim().min(1).max(2000),
  language: z.string().default('auto'),
  history: z.array(historySchema).max(6).default([]),
  mode: z.enum(['single', 'compare']).default('single')
});
const languageSchema = z.union([z.literal('auto'), z.string().refine((value) => Boolean(languageByCode(value)), 'Unsupported language')]);

async function getPhones(ids: string[]): Promise<Phone[]> {
  const phones: Phone[] = [];
  for (const id of ids) {
    const cached = cache.getDetail<Phone>(id);
    const phone = cached ?? await mobileApiClient.getPhoneById(id);
    if (!cached) cache.setDetail(id, phone);
    phones.push(phone);
  }
  return phones;
}
function requestedLanguage(value: string, message: string): string {
  if (value !== 'auto') return languageByCode(value)?.englishName ?? 'English';
  if (/[\u0900-\u097f]/u.test(message)) return 'Hindi';
  if (/[\u0c00-\u0c7f]/u.test(message)) return 'Telugu';
  if (/[\u0b80-\u0bff]/u.test(message)) return 'Tamil';
  return 'English';
}
function writeSse(res: Response, event: string, data: unknown): void {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

router.get('/assistant/suggestions', (req: Request, res: Response) => {
  const language = typeof req.query.language === 'string' && languageByCode(req.query.language) ? req.query.language : 'en';
  res.json({ language, suggestions: suggestions[language] ?? suggestions.en });
});

router.post('/assistant/chat', assistantRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError('INVALID_INPUT', parsed.error.errors[0]?.message ?? 'Invalid assistant request', 400);
    const body = parsed.data;
    const language = languageSchema.parse(body.language);
    const phones = await getPhones(body.phoneIds);
    const context = buildAssistantContext(phones);
    const languageName = requestedLanguage(language, body.message);
    const messages = buildAssistantMessages(context, body.message, languageName, body.history as LlmMessage[]);
    const cacheKey = `assistant:${body.phoneIds.join(',')}:${languageName}:${body.message.toLowerCase().replace(/\s+/g, ' ').trim()}`;
    const cached = cache.getSearch<{ answer: string; sources: string[]; language: string; estimate: boolean; demo: boolean }>(cacheKey);
    if (cached && req.headers.accept?.includes('application/json')) { res.json(cached); return; }
    if (req.headers.accept?.includes('application/json')) {
      const answer = await llmProvider.generate({ messages, maxOutputTokens: 500, temperature: 0.2 });
      const result = { answer, sources: context.sources, language: languageName, estimate: true, demo: llmProvider.name === 'mock' };
      cache.setSearch(cacheKey, result);
      res.json(result);
      return;
    }
    res.status(200).set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    for await (const chunk of llmProvider.stream({ messages, maxOutputTokens: 500, temperature: 0.2 })) writeSse(res, 'token', { text: chunk });
    writeSse(res, 'final', { sources: context.sources, language: languageName, estimate: true, demo: llmProvider.name === 'mock' });
    res.end();
  } catch (error) {
    if (res.headersSent) { writeSse(res, 'error', { code: 'AI_UNAVAILABLE', message: 'Assistant unavailable' }); res.end(); return; }
    next(error);
  }
});

router.post('/assistant/compare-summary', assistantRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = z.object({ phoneIds: z.array(z.string().regex(/^\d{1,12}$/)).min(2).max(4), language: z.string().default('en') }).safeParse(req.body);
    if (!parsed.success) throw new AppError('INVALID_INPUT', 'phoneIds must contain 2 to 4 valid phone IDs', 400);
    const phones = await getPhones(parsed.data.phoneIds);
    const context = buildAssistantContext(phones);
    const text = await llmProvider.generate({ messages: buildAssistantMessages(context, 'Compare these phones for battery life, photos, gaming, display/media, portability and value. Return balanced guidance.', languageByCode(parsed.data.language)?.englishName ?? 'English', []), maxOutputTokens: 500 });
    res.json({ headline: 'Comparison guidance', bestFor: phones.map((phone) => ({ need: 'Overall fit', phoneId: String(phone.id), reason: text.slice(0, 240) })), tradeOffs: ['Specifications do not replace real-world testing.'], caveat: 'This is guidance from listed specifications, not a guaranteed recommendation.', demo: llmProvider.name === 'mock' });
  } catch (error) { next(error); }
});

export default router;
