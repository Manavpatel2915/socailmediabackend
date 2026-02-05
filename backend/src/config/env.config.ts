import "dotenv/config";

export type Env = "development" | "test" | "production";

function required(name: string): string {
  const value = process.env[name];
  
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const ENV: Env = (process.env.NODE_ENV as Env) || "development";

export const env = {
  NODE_ENV: ENV,

  DB: {
    MONGODB_URL: required("MONGODB_URL"),
    DB_NAME: required("DB_NAME"),
    DB_PORT: required("DB_PORT"),
    DB_USER: required("DB_USER"),
    DB_PASSWORD:required("DB_PASSWORD"),
    DB_HOST:required("DB_HOST"),
   
  },
};