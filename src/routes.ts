import { Router, type Response, type Request } from 'express';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'HireHub API is running',
  });
});

export default router;
