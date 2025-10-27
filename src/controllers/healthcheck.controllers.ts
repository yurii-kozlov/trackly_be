import type { Request, Response } from 'express';

import { ApiResponse } from "#utils/api-response.js";
import { asyncHandler } from '#utils/async-handler.js';

const healthCheck = asyncHandler((_req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, {
    message: 'The server is running'
  }));
});

export { healthCheck };
