import mongoose from 'mongoose';
import config from './index.js';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.db.url);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
