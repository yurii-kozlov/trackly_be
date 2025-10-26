import type { Request, Response } from 'express';

import { ApiResponse } from "#utils/api-response.js";

const healthCheck = (_req: Request, res: Response) =>{
  try {
    res
      .status(200)
      .json(new ApiResponse(200, { message: 'Ther server is running'}));
  } catch (error: unknown) {
    console.error(error);
  }
}

export { healthCheck };
