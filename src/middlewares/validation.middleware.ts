import type { Request, Response, NextFunction } from 'express';
import type z from 'zod';

export const validate =
  (schema: z.ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const data = schema.parse(req.body);
    req.body = data;
    next();
  };
