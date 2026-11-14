// Optional legacy Vercel serverless entrypoint. The `services` config in
// vercel.json deploys server/ (entry: server/src/app.js) instead, but this file
// stays consistent in case a project is configured to use it.
import { connectDb } from '../server/src/db.js';
import app from '../server/src/app.js';

export default async function handler(req, res) {
  try {
    await connectDb();
  } catch {
    return res.status(503).json({ message: 'Database unavailable' });
  }
  return app(req, res);
}
