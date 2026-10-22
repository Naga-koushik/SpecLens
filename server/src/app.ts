import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import healthRoutes from './routes/health.js';
import phonesRoutes from './routes/phones.js';
import brandsRoutes from './routes/brands.js';
import compareRoutes from './routes/compare.js';
import finderRoutes from './routes/finder.js';
import assistantRoutes from './routes/assistant.js';

export function createApp() {
  const app = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration (supports comma-separated origins)
  const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
  app.use(
    cors({
      origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  // Compression
  app.use(compression());

  // JSON Body Parser
  app.use(express.json({ limit: '32kb' }));

  // Safe Request Logging (never log sensitive headers or query keys)
  if (env.NODE_ENV !== 'test') {
    app.use(
      morgan((tokens, req, res) => {
        // Strip any accidental 'key' query parameter from log output
        const url = (tokens.url(req, res) || '').replace(/([?&]key=)[^&]+/i, '$1[REDACTED]');
        return [
          tokens.method(req, res),
          url,
          tokens.status(req, res),
          tokens['response-time'](req, res), 'ms'
        ].join(' ');
      })
    );
  }

  // Rate Limiter
  app.use('/api', apiRateLimiter);

  // Mount API Routes
  app.use('/api', healthRoutes);
  app.use('/api', phonesRoutes);
  app.use('/api', brandsRoutes);
  app.use('/api', compareRoutes);
  app.use('/api', finderRoutes);
  app.use('/api', assistantRoutes);

  // 404 for unknown API routes
  app.use('/api/*', (_req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'API endpoint not found'
      }
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
