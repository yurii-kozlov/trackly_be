import type { Request, Response } from 'express';

import express from 'express';

const app = express();

app.get('/test', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express + TypeScript Server!' });
});

export default app;
