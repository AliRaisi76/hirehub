import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { updateUserSchema } from './users.validation.js';
import { validate } from '../../middlewares/validation.middleware.js';

const router = Router();

router.get('/me', requireAuth, UsersController.getMe);

router.patch('/me', requireAuth, validate(updateUserSchema), UsersController.updateMe);

export const usersRoutes = router;
