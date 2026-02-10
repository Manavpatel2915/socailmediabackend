import mongodbconnect from './mongodbconnect';
import { connectDatabase } from './sqldbconnnect';
import dbPromise from './sqldbconnnect';

const connectdb = async (): Promise<void> => {
  try {




    await mongodbconnect();


    await connectDatabase();


    const db = await dbPromise;


    const modelNames = Object.keys(db).filter(
      key => key !== 'sequelize' && key !== 'Sequelize'
    );


    console.log(' Models:', modelNames.join(', '));



  } catch (error) {
    console.error(' Database connection failed:', error);
    throw error;
  }
};

export default connectdb;