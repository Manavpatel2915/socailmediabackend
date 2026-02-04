import { Sequelize, Model, ModelStatic } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from "../models/usermodel.sql";
import CommentModel from "../models/commentmodel.sql";
import PostModel from "../models/postmodel.sql";

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'airbin';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  logging: false,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Type for models with associate method
type ModelWithAssociate = ModelStatic<Model> & {
  associate?: (models: Database) => void;
};

interface Database {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  User: ReturnType<typeof UserModel>;
  Post: ReturnType<typeof PostModel>;
  Comment: ReturnType<typeof CommentModel>;
}

const db: Database = {
  Sequelize,
  sequelize,
  User: UserModel(sequelize),
  Post: PostModel(sequelize),
  Comment: CommentModel(sequelize), 
};

// Initialize all associations - only process actual models
const models: ModelWithAssociate[] = [
  db.User,
  db.Post,
  db.Comment,
];

models.forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

export const connectDatabase = async (): Promise<void> => {
  try {
    // await sequelize.sync({ force: true });
    await sequelize.authenticate();
    console.log(`Database "${DB_NAME}" connected successfully at ${DB_HOST}:${DB_PORT}`);
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export default db;  