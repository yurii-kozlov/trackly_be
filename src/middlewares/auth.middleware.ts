import type { AuthRequest } from '#controllers/auth/types.js';
import type { AccessTokenPayload } from '#models/user/types.js';
import type { NextFunction, Response } from 'express';

import { User } from '#models/user/user.models.js';
import { asyncHandler } from '#utils/async-handler.js';
import { ApiError } from '#utils/error-response.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as AccessTokenPayload;

      const user = await User.findById(decodedToken._id).select(
        '-password -refreshToken -emailVerificationToken -emailVerificationExpiry',
      );

      if (!user) {
        throw new ApiError(401, 'Invalid access token');
      }

      req.user = user;
      next();
    } catch (error: unknown) {
      throw new ApiError(401, 'Invalid access token', [error]);
    }
  },
);
