import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      maxPoolSize: 100,        // Connection pool for high load
      minPoolSize: 10,         // Minimum connections ready
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("db connected with connection pooling");
  } catch (error) {
    console.log("db error", error);
    process.exit(1);
  }
};

export default connectDb;
