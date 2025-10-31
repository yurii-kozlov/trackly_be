import type { IUser } from '#models/user/types.js';

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
