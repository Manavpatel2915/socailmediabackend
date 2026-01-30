import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url:string = process.env.MONGODB_URL as string ;

const connectMongodb = async (): Promise<void> => {
  try {
    if (!url) {
      throw new Error('MONGODB_URL is not found in environment variables');
    }
    await mongoose.connect(url);
    console.log(` MongoDB connected successfully`);
  } catch (error) {
    console.error(' MongoDB connection error:', error);
    throw error; 
  }
};

export default connectMongodb;
