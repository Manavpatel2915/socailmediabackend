import mongodbconnect from './mongodbconnect';
import { connectDatabase } from './sqldbconnnect';

const connectdb = async (): Promise<void> => {
  try {

    await mongodbconnect();
    await connectDatabase();
    
    console.log(' All database connections established');
  } catch (error) {
    console.error(' Database connection failed:', error);
    throw error; 
  }
};

export default connectdb;