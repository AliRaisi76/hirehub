import type { Request, Response } from 'express';
import { UsersService } from './users.service.js';
import { type UpdateUserInput } from './users.types.js';

export class UsersController {
  static getMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const userId = req.user.sub;

    const user = await UsersService.getCurrentUser(userId);
    res.json({
      success: true,
      data: user,
    });
  };

  static updateMe = async (
    req: Request<unknown, unknown, UpdateUserInput>,
    res: Response,
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const userId = req.user.sub;
    const updatData = req.body;

    const user = await UsersService.updateCurrentUser(userId, updatData);

    res.json({
      success: true,
      data: user,
    });
  };
}
