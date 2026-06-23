import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../common/errors/AppError.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { Prisma } from '@prisma/client';

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = err.issues.map((issue) => ({
      field: issue.path.length ? issue.path.join('.') : 'root',
      message: issue.message,
      code: issue.code,
    }));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Resource already exists';
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (statusCode >= 500) {
    logger.error({ err }, 'Unhandled server error');
  } else {
    logger.warn({ err }, 'Handled application error');
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(env.NODE_ENV !== 'production' && err instanceof Error ? { stack: err.stack } : {}),
  });
};
