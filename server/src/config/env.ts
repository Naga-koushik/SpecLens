import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  USE_MOCK: z.string().default('true').transform((val) => val === 'true'),
  MOBILEAPI_KEY: z.string().optional().default(''),
  CACHE_SEARCH_TTL_MS: z.string().default('300000').transform((val) => parseInt(val, 10)),
  CACHE_DETAIL_TTL_MS: z.string().default('3600000').transform((val) => parseInt(val, 10)),
  CACHE_BRANDS_TTL_MS: z.string().default('86400000').transform((val) => parseInt(val, 10)),
  FINDER_CURRENCY: z.string().default('INR'),
  AI_PROVIDER: z.enum(['mock', 'anthropic', 'gemini', 'ollama', 'openai-compatible']).default('mock'),
  LLM_API_KEY: z.string().optional().default(''),
  LLM_MODEL: z.string().default('qwen3:8b'),
  OLLAMA_MODEL: z.string().default('qwen3:8b'),
  LLM_BASE_URL: z.string().optional().default(''),
  AI_TIMEOUT_MS: z.string().default('15000').transform((val) => parseInt(val, 10)),
  AI_MAX_OUTPUT_TOKENS: z.string().default('500').transform((val) => parseInt(val, 10)),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
