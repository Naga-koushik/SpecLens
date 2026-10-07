import { Request, Response, NextFunction } from 'express';
import { ErrorCode, ApiErrorResponse } from '../types/index.js';

export class AppError extends Error {
  public code: ErrorCode;
  public statusCode: number;

  constructor(code: ErrorCode, message: string, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response<ApiErrorResponse>,
  _next: NextFunction
): void {
  // Never leak internal stack traces or secrets
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
    return;
  }

  // Handle SyntaxError (malformed JSON) or ZodError
  if ('status' in err && (err as any).status === 400) {
    res.status(400).json({
      error: {
        code: 'INVALID_INPUT',
        message: 'Malformed request payload or parameters'
      }
    });
    return;
  }

  console.error('[Internal Error]:', err.message);

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected internal error occurred. Please try again later.'
    }
  });
}
