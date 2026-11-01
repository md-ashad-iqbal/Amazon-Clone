import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[ShopSphere Database] No MONGODB_URI provided in environment. Running in resilient In-Memory Mock Store mode.');
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[ShopSphere Database] Connected to MongoDB Atlas: ${conn.connection.host}`);
    isConnected = true;
    return true;
  } catch (error) {
    console.warn(`[ShopSphere Database] MongoDB connection failed: ${(error as Error).message}. Falling back to resilient In-Memory Mock Store.`);
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
