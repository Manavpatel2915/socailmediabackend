import db, { initModels } from './index';

export const connectDatabase = async (): Promise<void> => {
  try {

    await initModels();

    await db.sequelize.authenticate();

    // await db.sequelize.sync({ force: true });
    // await db.sequelize.sync({ alter: true });
    console.log(' Database synced successfully');

  } catch (error) {
    console.error(' Database connection error:', error);
    throw error;
  }
};

export default db;