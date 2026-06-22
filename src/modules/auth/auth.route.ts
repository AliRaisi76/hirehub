import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { validate } from '../../middlewares/validation.js';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), AuthController.register);
authRouter.post('/login', validate(loginSchema), AuthController.login);
