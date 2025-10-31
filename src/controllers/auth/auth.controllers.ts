import { authService } from '#services/auth.services.js';
import { ApiResponse } from '#utils/api-response.js';
import { asyncHandler } from '#utils/async-handler.js';
import { ApiError } from '#utils/error-response.js';
import { type CookieOptions, type Request, type Response } from 'express';

import type { 
  UserLoginPayload as LoginUserBody, 
  RegisterUserArgs as RegisterUserBody 
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
        username
      });

      return res.status(201).json(
        new ApiResponse(
          201,
          { user: createdUser },
          'The user has been successfully registered and the verification email has been sent to your email'
        )
      );
    }
  );

  public login = asyncHandler(
    async (req: Request<unknown, unknown, LoginUserBody>, res: Response) => {
      const { email, password, username } = req.body;

      if (!email) {
        throw new ApiError(400, 'Email is required');
      }

      const { accessToken, loggedInUser, refreshToken } = await authService.login({ email, password, username});

      const options: CookieOptions = {
        httpOnly: true,
        secure: true
      }

      return res 
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              accessToken,
              user: loggedInUser
            },
            'The user has been logged in successfully'
          )
        )
    })
}

const authController = new AuthController();

export { authController };