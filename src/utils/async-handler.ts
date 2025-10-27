import type { NextFunction, Request, RequestHandler, Response } from 'express';

const asyncHandler = <T = void>(
  requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<T> | T
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};


export { asyncHandler };
