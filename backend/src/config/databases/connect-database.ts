import connectMongo from './mongo-connect';
import { connectSql } from './sql-connect';
import './redis-connect';
import dbPromise from './sql-connect';
import { connectRabbitMQ } from '../rabbitmq'


const connectDatabase = async (): Promise<void> => {
  try {
    await connectMongo();
    await connectSql();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const db = await dbPromise;
    await connectRabbitMQ();
  } catch (error) {
    console.error(' Database connection failed:', error);
    throw error;
  }
};

export default connectDatabase;

