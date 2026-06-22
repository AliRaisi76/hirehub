import { prisma } from '../../config/prisma.js';
import { AppError } from '../../common/errors/AppError.js';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { Role, type User } from '@prisma/client';
import { env } from '../../config/env.js';

export class AuthService {
  private static generateToken(user: User): string {
    return jwt.sign({ id: user.id, role: user.role }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
    });
  }

  static register = async (email: string, password: string): Promise<object> => {
    const count = await prisma.user.count({ where: { email } });
    if (count > 0) {
      throw new AppError('Email already taken', 409);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: Role.CANDIDATE,
      },
    });

    const token = this.generateToken(user);

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  };

  static login = async (email: string, password: string): Promise<object> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 403);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new AppError('Invalid email or password', 403);
    }

    const token = this.generateToken(user);

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  };
}
