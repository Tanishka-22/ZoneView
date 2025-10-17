import mongoose from 'mongoose';

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: CachedConnection = {
  conn: null,
  promise: null
};

const connectDB = async (): Promise<typeof mongoose | undefined> => {
  try {
    if (typeof process === 'undefined' || !process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGODB_URI, {
        bufferCommands: false,
      });
    }

    cached.conn = await cached.promise;
    console.log('MongoDB connected ✅');
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection failed ❌', error);
    process.exit(1);
  }
};

export default connectDB;