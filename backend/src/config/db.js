import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  await mongoose.connect(env.MONGODB_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
};

export const disconnectDB = () => mongoose.disconnect();
