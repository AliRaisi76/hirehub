import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import type { RegisterInput, LoginInput } from './auth.validation.js';

export class AuthController {
  static register = async (
    req: Request<unknown, unknown, RegisterInput>,
    res: Response,
  ): Promise<Response> => {
    const { email, password } = req.body;
    const user = await AuthService.register(email, password);
    return res.status(201).json({
      success: true,
      data: user,
    });
  };

  static login = async (
    req: Request<unknown, unknown, LoginInput>,
    res: Response,
  ): Promise<Response> => {
    const { email, password } = req.body;
    const user = await AuthService.login(email, password);
    return res.json({ success: true, data: user });
  };
}
