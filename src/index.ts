import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';

dotenv.config({
  path: './.env',
})
console.log('wasssup');

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/test', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express + TypeScript Server!' });
});

app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
