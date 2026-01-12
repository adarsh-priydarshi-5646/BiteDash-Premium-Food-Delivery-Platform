/**
 * MongoDB Connection - Database connection with optimized pooling
 *
 * Connection pooling: 100 max, 20 min connections for high traffic
 * Timeouts: 5s server selection, 10s socket, 30s idle
 * 
 * Libraries: mongoose
 * Features: Auto-reconnect, graceful shutdown, connection event logging
 * Env: MONGODB_URL (connection string with credentials)
 */
import mongoose from 'mongoose';
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      maxPoolSize: 100,
      minPoolSize: 20,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      w: 'majority',
      wtimeoutMS: 2500,
      readPreference: 'primaryPreferred',
      compressors: ['zlib'],
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting reconnect...');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    });

    console.log('DB connected');
  } catch (error) {
    console.error('DB connection error:', error);
    process.exit(1);
  }
};

export default connectDb;
