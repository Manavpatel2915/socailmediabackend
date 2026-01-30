import mongodbconnect from './mongodbconnect';
import { connectDatabase } from './sqldbconnnect';

const connectdb = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await mongodbconnect();
    
    // Connect to MySQL/Sequelize
    await connectDatabase();
    
    console.log('✅ All database connections established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error; // Re-throw to prevent server from starting without DB
  }
};

export default connectdb;