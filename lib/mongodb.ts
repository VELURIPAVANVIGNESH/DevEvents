import mongoose, { type Mongoose } from "mongoose";

/**
 * Connection state cached across hot-reloads in development.
 *
 * Next.js re-evaluates modules frequently during development (HMR), which can
 * otherwise create many MongoDB connections. Caching the promise ensures we
 * reuse the same in-flight connection attempt.
 */
type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongoose ?? { conn: null, promise: null };

globalThis.mongoose = cached;

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // Fail fast so misconfiguration is caught immediately in every environment.
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri)
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
