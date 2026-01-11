import mongoose from "mongoose";

const connectDb = async () => {
  try {
    // Optimized connection settings for high load (5000+ req/s)
    await mongoose.connect(process.env.MONGODB_URL, {
      // Connection Pool Settings
      maxPoolSize: 100,          // Max connections in pool
      minPoolSize: 20,           // Min connections ready
      maxIdleTimeMS: 30000,      // Close idle connections after 30s
      
      // Timeout Settings
      serverSelectionTimeoutMS: 5000,  // Fail fast if can't connect
      socketTimeoutMS: 45000,          // Socket timeout
      connectTimeoutMS: 10000,         // Initial connection timeout
      
      // Write Concern for performance
      w: 'majority',
      wtimeoutMS: 2500,
      
      // Read Preference
      readPreference: 'primaryPreferred',
      
      // Compression for network efficiency
      compressors: ['zlib'],
    });

    // Connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected with optimized pool');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting reconnect...');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    console.log("DB connected with connection pooling (max: 100)");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

export default connectDb;
