import mongoose from "mongoose";
import '../models'; // Import models to ensure they're registered

const MONGODB_URI = process.env.MONGODB_URI || process.env.DB_URL || "mongodb://localhost:27017/Notezy";

if (!MONGODB_URI) {
  throw new Error(
    'Please define the DB_URL environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    console.log('Using existing database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "Notezy"
    };

    console.log('Creating new database connection');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Database connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('Database connection error:', error);
        throw error; // Re-throw to be caught by the caller
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};