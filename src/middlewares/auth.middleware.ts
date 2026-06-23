import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { type Role } from '@prisma/client';
import { AppError } from '../common/errors/AppError.js';
import { env } from '../config/env.js';

export interface AuthPayload {
  sub: string;
  role: Role;
}

function isAuthPayload(payload: unknown): payload is AuthPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof (payload as Record<string, unknown>).sub === 'string' &&
    typeof (payload as Record<string, unknown>).role === 'string'
  );
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401);
  }

  const token = authHeader.split(' ')[1] as string;

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;

    if (!isAuthPayload(payload)) {
      throw new AppError('Invalid token payload', 401);
    }

    req.user = payload;

    next();
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
};

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      throw new AppError('Forbidden', 403);
    }
    next();
  };
