import { type Role } from '@prisma/client';
import { type updateUserSchema } from './users.validation.js';
import type z from 'zod';

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  joinedAt: Date;
  firstName?: string;
  lastName?: string;
}

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
