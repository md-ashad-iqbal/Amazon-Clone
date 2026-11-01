import app from '../server/app';
import { connectDB } from '../server/config/db';

let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    await connectDB();
    initialized = true;
  }
  return app(req, res);
}
