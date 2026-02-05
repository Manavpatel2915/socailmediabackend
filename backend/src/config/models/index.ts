import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url'; 
import { Sequelize, DataTypes, ModelStatic, Model } from 'sequelize';
import configJson from '../config.json';
import dotenv from 'dotenv';

dotenv.config();

const basename = path.basename(__filename);
console.log("🚀 ~ basename:", basename)
const env = process.env.NODE_ENV || 'development';
console.log("🚀 ~ env:", env)

// Define config type
interface Config {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: 'mysql';
  use_env_variable?: string;
  [key: string]: any;
}

const config = configJson[env as keyof typeof configJson] as Config;


// Define the database interface
interface DbInterface {
  [key: string]: ModelStatic<Model> | Sequelize | typeof Sequelize;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}


type ModelWithAssociate = ModelStatic<Model> & {
  associate?: (db: DbInterface) => void;
};

const db = {} as DbInterface;


const DB_NAME = process.env.DB_NAME || config.database;
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;

// Initialize Sequelize
let sequelize: Sequelize;
if (config.use_env_variable && process.env[config.use_env_variable]) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    {
      ...config,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
 
} else {
  sequelize = new Sequelize(
    DB_NAME,
    config.username,
    config.password || '',
    {
      host: config.host,
      port: DB_PORT,
      dialect: config.dialect,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
  console.log("run else case ")
}

// Dynamically load all model files
const initModels = async (): Promise<DbInterface> => {

  
  const files = fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        (file.endsWith('-model.js') || file.endsWith('-model.ts'))
      );
    });

 

  // Import all models sequentially
  for (const file of files) {
    try {
     
      const filePath = path.join(__dirname, file);
     
      const fileUrl = pathToFileURL(filePath).href;
  
      
      const modelModule = await import(fileUrl);

      const modelFactory = modelModule.default || modelModule;
      
      
      // Initialize the model
      const model = modelFactory(sequelize, DataTypes) as ModelStatic<Model>;
    
      db[model.name] = model;
      
      
    } catch (error) {
      console.error(`  ✗ Error loading model from file ${file}:`, error);
    }
  }

  // Set up associations after all models are loaded
  const modelNames = Object.keys(db);

  if (modelNames.length > 0) {
   
    
    modelNames.forEach(modelName => {
      const model = db[modelName] as ModelWithAssociate;
     
      
      if (model.associate) {
        model.associate(db);
        
      }
    });
  }

  // Add Sequelize instances to db object
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  console.log('✅ All models initialized successfully');
  
  return db;
};


export default initModels();