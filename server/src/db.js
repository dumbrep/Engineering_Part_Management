import mongoose from 'mongoose';
import config from './config.js';

// Cached across invocations so serverless (Vercel) reuses one connection.
let connecting;

/**
 * Connects to MongoDB once per process and returns the shared connection.
 * Safe to call on every request; failed attempts are retried on the next call.
 */
export function connectDb() {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);

  connecting ??= mongoose
    .connect(config.mongoUri, {
      // Always use an explicit database name so a URI without one never
      // falls back to Mongo's default "test" database.
      dbName: config.dbName,
      serverSelectionTimeoutMS: 8000,
    })
    .then((m) => {
      console.log(`MongoDB connected (db: ${m.connection.name})`);
      return m.connection;
    })
    .catch((err) => {
      connecting = undefined; // allow a retry on the next request
      throw err;
    });

  return connecting;
}
