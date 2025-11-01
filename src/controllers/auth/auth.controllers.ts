import { authService } from '#services/auth.services.js';
import { ApiResponse } from '#utils/api-response.js';
import { asyncHandler } from '#utils/async-handler.js';
import { ApiError } from '#utils/error-response.js';
import { type CookieOptions, type Request, type Response } from 'express';

import type { 
  AuthRequest,
  CookieRequest,
  UserLoginPayload as LoginUserBody, 
  RegisterUserArgs as RegisterUserBody, 
  RequestUserData,
  VerifyEmailParams
} from './types.js';

class AuthController {
  public registerUser = asyncHandler(
    async (req: Request<unknown, unknown, RegisterUserBody>, res: Response) => {
      const { email, fullname, password, role, username } = req.body;
      const protocol = req.protocol;
      const host = req.get('host');

      if (!host) {
        throw new ApiError(400, 'Host header is missing');
      }

      const createdUser = await authService.registerUser({
        email,
        fullname,
        host,
        password,
        protocol,
        role,
        username,
      });

      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            { user: createdUser },
            'The user has been successfully registered and the verification email has been sent to your email',
          ),
        );
    },
  );

  public login = asyncHandler(
    async (req: Request<unknown, unknown, LoginUserBody>, res: Response) => {
      const { email, password, username } = req.body;

      if (!email) {
        throw new ApiError(400, 'Email is required');
      }

      const { accessToken, loggedInUser, refreshToken } = await authService.login({
        email,
        password,
        username,
      });

      const options: CookieOptions = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              accessToken,
              user: loggedInUser,
            },
            'The user has been logged in successfully',
          ),
        );
    },
  );

  public logoutUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    await authService.logoutUser(req.user?._id as string);

    const options: CookieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json(new ApiResponse(200, {}, 'The user has been logged out'));
  });

  public getCurrentUser = asyncHandler((req: AuthRequest, res: Response) => {
    return res
      .status(200)
      .json(
        new ApiResponse<null | RequestUserData>(
          200,
          req.user ?? null,
          'User data has been successfully fetched',
        ),
      );
  });

  public verifyEmail = asyncHandler(async (req: AuthRequest<VerifyEmailParams>, res: Response) => {
    const { verificationToken } = req.params;

    if (!verificationToken) {
      throw new ApiError(400, 'Email verification token is missing');
    }

    await authService.verifyEmail(verificationToken);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isEmailVerified: true,
        },
        'The email has been successfully verified',
      ),
    );
  });

  public resendEmailVerification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const protocol = req.protocol;
    const host = req.get('host') as string;

    if (req.user?._id) {
      throw new ApiError(400, "The user doesn't exist");
    }

    await authService.resendEmailVerification(req.user?._id as string, protocol, host);

    return res.status(200).json(new ApiResponse(200, {}, 'Mail has been sent to your email ID'));
  });

  public refreshAccessToken = asyncHandler(async (req: CookieRequest, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, 'Unauthorized access');
    }

    const options: CookieOptions = {
      httpOnly: true,
      secure: true,
    };

    try {
      const { newAccessToken, newRefreshToken } =
        await authService.refreshAccessToken(incomingRefreshToken);

      return res
        .status(200)
        .cookie('accessToken', newAccessToken, options)
        .cookie('refreshToken', newRefreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              accessToken: newAccessToken,
            },
            'The access token has been refreshed',
          ),
        );
    } catch (error) {
      throw new ApiError(401, 'Invalid Refresh token', [error]);
    }
  });
}

const authController = new AuthController();

export { authController };