import dotenv from 'dotenv';
import dbPromise from './models/index';


dotenv.config();

const DB_NAME = process.env.DB_NAME || 'airbin';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;

export const connectDatabase = async (): Promise<void> => {
  try {
    
    
    const db = await dbPromise;
    
    

    await db.sequelize.authenticate();
   
    
  
    // await db.sequelize.sync(); 
    // await db.sequelize.sync({ alter: true });
    // await db.sequelize.sync({ force: true }); 
    

    
  } catch (error) {
    console.error(' Database connection error:', error);
    throw error;
  }
};

export default dbPromise;