import { type AuthPayload } from '../middlewares/auth.middleware.ts';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
