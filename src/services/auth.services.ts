import type { RegisterUserArgs, UserLoginPayload } from "#controllers/auth/types.js";

import { User } from "#models/user/user.models.js";
import { sendEmail } from "#services/mail-service/index.js";
import { ApiError } from "#utils/error-response.js";
import { emailVerificationMailgenContent } from "#utils/mail.js";

import { generateTokens } from "./token.services.js";

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

    const { refreshToken } = await generateTokens(user._id as string);

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

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

    const { accessToken, refreshToken } = await generateTokens(user._id as string);

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
};

const authService = new AuthService();

export { authService };
