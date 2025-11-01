import type { RegisterUserArgs, UserLoginPayload } from "#controllers/auth/types.js";
import type { IUserDocument, RefreshTokenPayload } from "#models/user/types.js";

import { User } from "#models/user/user.models.js";
import { sendEmail } from "#services/mail-service/index.js";
import { ApiError } from "#utils/error-response.js";
import { emailVerificationMailgenContent } from "#utils/mail.js";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { tokenService } from "./token.services.js";

class AuthService {
  public async registerUser({
    email,
    fullname,
    host,
    password,
    protocol,
    username,
  }: RegisterUserArgs) {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ApiError(409, 'User with this email or username already exists', []);
    }

    const user = await User.create({
      email,
      fullname,
      isEmailVerified: false,
      password,
      username,
    });

    const { refreshToken } = await tokenService.generateTokens(user._id as string);

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    await this.sendEmail(user, protocol, host);

    const createdUser = await User.findById(user._id).select(
      '-password -refreshToken -emailVerificationToken -emailVerificationExpiry',
    );

    if (!createdUser) {
      throw new ApiError(500, 'Something went wrong while registering a user');
    }

    return createdUser;
  }

  public async login({ email, password }: UserLoginPayload) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(400, "The user doesn't exist");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw new ApiError(400, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await tokenService.generateTokens(user._id as string);

    const loggedInUser = await User.findById(user._id).select(
      '-password -refreshToken -emailVerificationToken -emailVerificationExpiry',
    );

    return {
      accessToken,
      loggedInUser,
      refreshToken,
    };
  }

  public async logoutUser(userId: string) {
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          refreshToken: '',
        },
      },
      {
        new: true,
      },
    );
  }

  public async verifyEmail(emailVerificationToken: string) {
    const hashedToken = crypto.createHash('sha256').update(emailVerificationToken).digest('hex');

    const user = await User.findOne({
      emailVerificationExpiry: { $gt: Date.now() },
      emailVerificationToken: hashedToken,
    });

    if (!user) {
      throw new ApiError(400, 'Token is invalid or expired');
    }

    user.emailVerificationExpiry = undefined;
    user.emailVerificationExpiry = undefined;
    user.isEmailVerified = true;

    await user.save({ validateBeforeSave: false });
  }

  public async resendEmailVerification(userId: string, protocol: string, host: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "The user doesn'n exist");
    }

    if (user.isEmailVerified) {
      throw new ApiError(409, 'Email has already been verified');
    }

    await this.sendEmail(user, protocol, host);
  }

  private async sendEmail(user: IUserDocument, protocol: string, host: string) {
    const { hashedToken, tokenExpiry, unhashedToken } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user.email,
      mailgenContent: emailVerificationMailgenContent(
        user.username,
        `${protocol}://${host}/api/v1/users/verify-email/${unhashedToken}`,
      ),
      subject: 'Please verify your email',
    });
  }

  async refreshAccessToken(incomingRefreshToken: string) {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as RefreshTokenPayload;

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, 'Refresh token has expired');
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await tokenService.generateTokens(user._id as string);

    user.refreshToken = newRefreshToken;

    await user.save();

    return {
      newAccessToken,
      newRefreshToken,
    };
  }
};

const authService = new AuthService();

export { authService };
