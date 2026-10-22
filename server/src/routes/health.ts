import { Router, Request, Response } from 'express';
import { llmProvider } from '../services/llm/index.js';

const router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  const ai = await llmProvider.health();
  res.json({
    status: ai.generationAvailable ? 'ok' : 'degraded',
    backend: 'ok',
    ai
  });
});

export default router;
