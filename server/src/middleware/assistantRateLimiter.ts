import rateLimit from 'express-rate-limit';

export const assistantRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Assistant rate limit reached. Please wait before asking again.' } });
  }
});
