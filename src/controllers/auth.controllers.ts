import { authService } from '#services/auth.services.js';
import { type UserRegistrationPayload as RegisterUserBody } from '#services/auth.services.js';
import { ApiResponse } from '#utils/api-response.js';
import { asyncHandler } from '#utils/async-handler.js';
import { ApiError } from '#utils/error-response.js';
import { type Request, type Response } from 'express';

class AuthController {
  registerUser = asyncHandler(
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
}

const authController = new AuthController();

export { authController };