import type { IUser } from '#models/user/types.js';
import type { Request } from 'express';

import { Document } from 'mongoose';

export type AuthRequest = Request & { user?: null | RequestUserData };
export interface BaseUserPayload {
  email: string;
  password: string;
  username: string;
}

export interface RegisterUserArgs extends UserRegistrationPayload {
  host: string;
  protocol: string;
}

export type UserLoginPayload = Pick<IUser, 'email' | 'password' | 'username'>;

export type UserRegistrationPayload = Pick<
  IUser,
  'email' | 'fullname' | 'password' | 'username'
> & {
  role?: string;
};

type RequestUserData = Omit<
  IUser,
  'emailVerificationExpiry' | 'emailVerificationToken' | 'password' | 'refreshToken'
> &
  Pick<Document, '_id'>;
