import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';

import type { AccessTokenPayload, IUserDocument, RefreshTokenPayload, UserModel } from './types.js';

const userSchema = new Schema<IUserDocument, UserModel>(
  {
    avatar: {
      default: {
        localPath: '',
        url: 'https://placehold.co/200x200',
      },
      type: {
        localPath: String,
        url: String,
      },
    },
    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    emailVerificationExpiry: Date,
    emailVerificationToken: String,
    forgotPasswordExpiry: Date,
    forgotPasswordToken: String,
    fullname: {
      required: true,
      type: String,
    },
    isEmailVerified: {
      default: false,
      type: Boolean,
    },
    password: {
      required: [true, 'The password is required'],
      type: String,
    },
    refreshToken: String,
    username: {
      index: true,
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

userSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const plainPassword = this.password;
  this.password = await bcrypt.hash(plainPassword, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (
  this: IUserDocument,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (this: IUserDocument) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiry = process.env.ACCESS_TOKEN_EXPIRY;

  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is not set');
  }

  const payload: AccessTokenPayload = {
    _id: String(this._id),
    email: this.email,
    username: this.username,
  };

  const secretTyped: Secret = secret as Secret;
  const expiryTyped: SignOptions['expiresIn'] = expiry as SignOptions['expiresIn'];

  const options: SignOptions = { expiresIn: expiryTyped ?? '15m' };

  return jwt.sign(payload, secretTyped, options);
};

userSchema.methods.generateRefreshToken = function (this: IUserDocument) {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const expiry = process.env.REFRESH_TOKEN_EXPIRY;

  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not set');
  }

  const payload: RefreshTokenPayload = { _id: String(this._id) };

  const secretTyped: Secret = secret as Secret;
  const expiryTyped: SignOptions['expiresIn'] = expiry as SignOptions['expiresIn'];

  const options: SignOptions = { expiresIn: expiryTyped ?? '30d' };

  return jwt.sign(payload, secretTyped, options);
};

userSchema.methods.generateTemporaryToken = function (this: IUserDocument) {
  const unhashedToken = crypto.randomBytes(20).toString('hex');

  const hashedToken = crypto
    .createHash('sha256')
    .update(unhashedToken)
    .digest('hex');
  
  const tokenExpiry = Date.now() + (20 * 60 * 1000); // 20 mins

  return { hashedToken, tokenExpiry, unhashedToken};
}

export const User = mongoose.model<IUserDocument, UserModel>('User', userSchema);
