import type { NextFunction, Request, Response } from "express";

import { ApiError } from "#utils/error-response.js";
import { validationResult } from "express-validator";

export const validate = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => {
    if (err.type === 'field') {
      return { [err.path]: err.msg as string }
    }
    return { [err.type]: err.msg as string }
  });

  throw new ApiError(422, 'Receieved data is not valid', extractedErrors);
};
