import { Router, type Response, type Request } from 'express';
import { authRouter } from './modules/auth/auth.route.js';
import { requireAuth, requireRole } from './middlewares/auth.middleware.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'HireHub API is running',
  });
});

router.use('/auth', authRouter);

router.get('/me', requireAuth, requireRole('CANDIDATE'), (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
