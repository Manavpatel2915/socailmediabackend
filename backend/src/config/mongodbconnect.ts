import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url:string = process.env.MONGODB_URL as string ;

const connectMongodb = async (): Promise<void> => {
  try {
    const connect = await mongoose.connect(url);
    console.log(`MongoDB connected at: ${url}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectMongodb;
