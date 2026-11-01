import type { Request, Response } from 'express';
import app from '../server/app';
import { connectDB } from '../server/config/db';

let initialized = false;

export default async function handler(req: Request, res: Response) {
  if (!initialized) {
    await connectDB();
    initialized = true;
  }
  return app(req, res);
}
