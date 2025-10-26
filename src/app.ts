import type { Request, Response } from 'express';

import cors from 'cors';
import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb'}));
app.use(express.static('public'));
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  origin: process.env.CORS_ORIGIN?.split(',') ?? 'http://localhost:5173'
}));

app.get('/test', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express + TypeScript Server!' });
});

export default app;
