import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from "../models/usermodel.sql";
import CommentModel from "../models/commentmodel.sql";
import PostModel from "../models/postmodel.sql";
import TokenModel from "../models/tokenmodel.sql";

dotenv.config();

// Database configuration from environment variables
const DB_NAME = process.env.DB_NAME || 'airbin';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;

// Sequelize instance
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

// Database connection interface
interface Database {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  User: ReturnType<typeof UserModel>;
  Post: ReturnType<typeof PostModel>;
  Comment: ReturnType<typeof CommentModel>;
  Token: ReturnType<typeof TokenModel>;
}

// Initialize database models
const db: Database = {
  Sequelize,
  sequelize,
  User: UserModel(sequelize),
  Post: PostModel(sequelize),
  Comment: CommentModel(sequelize),
  Token: TokenModel(sequelize),
};

// Define associations
// User -> Posts (one-to-many)
db.User.hasMany(db.Post, {
  foreignKey: 'user_id',
  as: 'posts'
});

db.Post.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Post -> Comments (one-to-many)
db.Post.hasMany(db.Comment, {
  foreignKey: 'post_id',
  as: 'comments'
});

db.Comment.belongsTo(db.Post, {
  foreignKey: 'post_id',
  as: 'post'
});

// User -> Comments (one-to-many, optional)
db.User.hasMany(db.Comment, {
  foreignKey: {
    name: "user_id",
    allowNull: true,
  },
  as: 'comments'
});

db.Comment.belongsTo(db.User, {
  foreignKey: {
    name: "user_id",
    allowNull: true,
  },
  as: 'user'
});

// Connection function with proper error handling
export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Database "${DB_NAME}" connected successfully at ${DB_HOST}:${DB_PORT}`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error; // Re-throw to allow caller to handle
  }
};

// Optional: Sync database schema (use with caution in production)
// db.sequelize.sync({ force: true }); // ⚠️ DANGER: Drops all tables!

export default db;
