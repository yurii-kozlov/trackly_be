import { Document, Model } from 'mongoose';

export interface IUserDocument extends Document, IUser {
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateTemporaryToken(): TemporaryToken;
  isPasswordCorrect(password: string): Promise<boolean>;
}

export type UserModel = Model<IUserDocument>;;

interface IUser {
  avatar: {
    localPath: string;
    url: string;
  };
  email: string;
  emailVerificationExpiry?: Date;
  emailVerificationToken?: string;
  forgotPasswordExpiry?: Date;
  forgotPasswordToken?: string;
  fullname: string;
  isEmailVerified: boolean;
  password: string;
  refreshToken?: string;
  username: string;
}

interface TemporaryToken {
  hashedToken: string;
  tokenExpiry: number;
  unhashedToken: string;
}
