import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let memoryServer: any = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gastrack';

  try {
    // Try connecting to the specified URI with a 10-second timeout for cloud connections
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully to: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
    return mongoose;
  } catch (error: any) {
    // If it's an external Atlas or custom URL that fails, or local mongod isn't running,
    // fallback gracefully to mongodb-memory-server so the app is immediately operable!
    console.warn(`[MongoDB] Could not connect to primary URI (${error.message}). Initializing embedded MongoDB engine...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri() + 'gastrack';
      
      await mongoose.connect(memUri);
      console.log(`[MongoDB] Connected to Embedded MongoDB instance at: ${memUri}`);
      console.log(`[MongoDB] To connect to MongoDB Atlas, set MONGODB_URI in backend/.env`);
      return mongoose;
    } catch (memErr: any) {
      console.error('[MongoDB] Failed to connect to any MongoDB instance:', memErr);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('[MongoDB] Disconnected successfully');
  } catch (error) {
    console.error('[MongoDB] Error during disconnect:', error);
  }
};
