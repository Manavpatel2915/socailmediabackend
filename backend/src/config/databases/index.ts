import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Sequelize, DataTypes, ModelStatic } from 'sequelize';
import { env } from "../env.config";
import { User } from "../models/sql-models/user-model";
import { Post } from "../models/sql-models/post-model";
import { Comment } from "../models/sql-models/comment-model";

const basename = path.basename(__filename);

export interface DbInterface {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  User: typeof User;
  Post: typeof Post;
  Comment: typeof Comment;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModelWithAssociate = ModelStatic<any> & {
  associate?: (db: DbInterface) => void;
};

const DB_NAME = env.DB.DB_NAME;
const DB_PORT = parseInt(env.DB.DB_PORT);
const DB_USER = env.DB.DB_USER;
const DB_PASSWORD = env.DB.DB_PASSWORD;
const DB_HOST = env.DB.DB_HOST;

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Cast db to DbInterface
const db = {
  sequelize,
  Sequelize
} as DbInterface;

const initModels = async (): Promise<void> => {
  const modelsPath = path.join(__dirname, '../models/sql-models');
  const files = fs.readdirSync(modelsPath)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        (file.endsWith('-model.js') || file.endsWith('-model.ts'))
      );
    });

  for (const file of files) {
    try {
      const filePath = path.join(modelsPath, file);
      const fileUrl = pathToFileURL(filePath).href;

      const modelModule = await import(fileUrl);
      const modelFactory = modelModule.default || modelModule;

      // Initialize the model
      const model = modelFactory(sequelize, DataTypes) as ModelWithAssociate;
      db[model.name] = model;

    } catch (error) {
      console.error(`Error loading model from file ${file}:`, error);
    }
  }

  const modelNames = Object.keys(db).filter(
    key => key !== 'sequelize' && key !== 'Sequelize'
  );

  if (modelNames.length > 0) {
    modelNames.forEach(modelName => {
      const model = db[modelName] as ModelWithAssociate;

      if (model.associate) {
        model.associate(db);
      }
    });
  }
};

export { initModels };
export default db;