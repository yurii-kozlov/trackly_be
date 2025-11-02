import type { IUser } from '#models/user/types.js';
import type { Request } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs'

import { Document } from 'mongoose';

export type AuthRequest<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  Q = ParsedQs,
> = Request<P, ResBody, ReqBody, Q> & {
  user?: null | RequestUserData;
};

export interface BaseUserPayload {
  email: string;
  password: string;
  username: string;
}

export interface ChangeCurrentPasswordBody {
  newPassword: string
  oldPassword: string;
}

export interface CookieRequest extends Request {
  cookies: {
    refreshToken?: string;
  };
}

export type ForgotPasswordBody = Pick<IUser, 'email'>;

export interface ForgotPasswordResetBody {
  newPassword: string
}

export interface ForgotPasswordResetParams {
  resetToken?: string
}

export interface RegisterUserArgs extends UserRegistrationPayload {
  host: string;
  protocol: string;
}

export type RequestUserData = Omit<
  IUser,
  'emailVerificationExpiry' | 'emailVerificationToken' | 'password' | 'refreshToken'
> &
  Pick<Document, '_id'>;

export type UserLoginPayload = Pick<IUser, 'email' | 'password' | 'username'>;

export type UserRegistrationPayload = Pick<
  IUser,
  'email' | 'fullname' | 'password' | 'username'
> & {
  role?: string;
};

export interface VerifyEmailParams {
  verificationToken?: string 
}