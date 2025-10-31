import type { Request, Response } from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb'}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  origin: process.env.CORS_ORIGIN?.split(',') ?? 'http://localhost:5173'
}));

import authRouter from '#routes/auth.routes.js';
import healthcheckRouter from '#routes/healthcheck.routes.js';

app.use('/api/v1/healthcheck', healthcheckRouter);
app.use('/api/v1/auth', authRouter);

app.get('/test', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express + TypeScript Server!' });
});

export default app;
