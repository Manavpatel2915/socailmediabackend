import { Sequelize, Model, ModelStatic } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from "./models/user-model";
import CommentModel from "./models/comment-model";
import PostModel from "./models/post-model";

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'airbin';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
const env = process.env.NODE_ENV || 'development';

const configs = {
  "development": {
    "username": "root",
    "password": "MANAVPATEL291",
    "database": "airbin",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

const config = configs[env];
const sequelize = new Sequelize(DB_NAME, config.username,config.password, {
  host: config.host,
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
    console.log(`Database "${DB_NAME}" connected successfully at ${config.username}:${DB_PORT}`);
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export default db;  