import "dotenv/config";

export type Env = "development" | "test" | "production";

const PROCESSENV = process.env;

function include(name: string): string {
  const value = PROCESSENV[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}
export const env = {
  NODE_ENV: (PROCESSENV.NODE_ENV as Env) || "development",

  DB: {
    MONGODB_URL: include("MONGODB_URL"),
    DB_NAME: include("DB_NAME"),
    DB_PORT: include("DB_PORT"),
    DB_USER: include("DB_USER"),
    DB_PASSWORD: include("DB_PASSWORD"),
    DB_HOST: include("DB_HOST"),
    PORT: include("PORT"),
  },

  JWT: {
    JWT_SECRET: include("JWT_SECRET"),
    TOKEN_EXPRI: include("TOKEN_EXPRI"),
    SALT: include("SALT")
  },

  CLOUDINARY: {
    CLOUDINARY_NAME: include("CLOUDINARY_NAME"),
    CLOUDINARY_API_KEY: include("CLOUDINARY_API_KEY"),
    CLOUDINARY_SECRET: include("CLOUDINARY_SECRET")
  },

  LOG: {
    LOG_PLACE: include("LOG_PLACE")
  }
};