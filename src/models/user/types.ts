import { Document, Model } from 'mongoose';

export interface IUser {
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

export interface IUserDocument extends Document, IUser {
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateTemporaryToken(): TemporaryToken;
  isPasswordCorrect(password: string): Promise<boolean>;
};

export type UserModel = Model<IUserDocument>;

interface TemporaryToken {
  hashedToken: string;
  tokenExpiry: Date;
  unhashedToken: string;
}
