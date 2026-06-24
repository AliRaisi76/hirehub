import { Router, type Response, type Request } from 'express';
import { authRouter } from './modules/auth/auth.route.js';
import { usersRoutes } from './modules/users/users.route.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'HireHub API is running',
  });
});

router.use('/auth', authRouter);
router.use('/users', usersRoutes);

export default router;
