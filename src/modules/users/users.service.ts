import { AppError } from '../../common/errors/AppError.js';
import { prisma } from '../../config/prisma.js';
import type { UserProfile, UpdateUserInput } from './users.types.js';

export class UsersService {
  static getCurrentUser = async (userId: string): Promise<UserProfile> => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      joinedAt: user.createdAt,
    };
  };

  static updateCurrentUser = async (
    userId: string,
    data: UpdateUserInput,
  ): Promise<UserProfile> => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        firstName: true,
        lastName: true,
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      joinedAt: updatedUser.createdAt,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    };
  };
}
