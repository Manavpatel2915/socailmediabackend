'use strict';
import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes, ModelStatic, Model } from "sequelize";
import configJson from "../config/config.json";

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

const config = configJson[env as keyof typeof configJson];

interface DbInterface {
  [key: string]: ModelStatic<Model>;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const db = {} as DbInterface;

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.endsWith('.js') || file.endsWith('.ts')) &&
      !file.endsWith('.test.js') &&
      !file.endsWith('.test.ts')
    );
  })
  .forEach(async (file) => {
    const modelModule = await import(path.join(__dirname, file));
    const modelFactory = modelModule.default || modelModule;

    const model = modelFactory(sequelize, DataTypes) as ModelStatic<Model>;
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  const model = db[modelName] as ModelStatic<Model> & {
    associate?: (db: DbInterface) => void;
  };
  
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;