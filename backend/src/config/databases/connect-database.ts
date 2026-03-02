import connectMongo from './mongo-connect';
import { connectSql } from './sql-connect';
import  './redis-connect';
import dbPromise from './sql-connect';

const connectDatabase = async (): Promise<void> => {
  try {
    await connectMongo();
    await connectSql();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const db = await dbPromise;
  } catch (error) {
    console.error(' Database connection failed:', error);
    throw error;
  }
};

export default connectDatabase;

