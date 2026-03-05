import "dotenv/config";

export type Env = "development" | "test" | "production";

const PROCESSENV = process.env;

function getEnvValue(name: string): string {
  const value = PROCESSENV[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: (PROCESSENV.NODE_ENV as Env) || "development",

  DB: {
    MONGODB_URL: getEnvValue("MONGODB_URL"),
    DB_NAME: getEnvValue("DB_NAME"),
    DB_PORT: getEnvValue("DB_PORT"),
    DB_USER: getEnvValue("DB_USER"),
    DB_PASSWORD: getEnvValue("DB_PASSWORD"),
    DB_HOST: getEnvValue("DB_HOST"),
    PORT: getEnvValue("PORT"),
    REDIS_HOST: getEnvValue("REDIS_HOST"),
    REDIS_PORT: getEnvValue("REDIS_PORT"),
    REDIS_PASSWORD: getEnvValue("REDIS_PASSWORD"),
    RABBITMQ_URL: getEnvValue("RABBITMQ_URL"),
  },

  JWT: {
    JWT_SECRET: getEnvValue("JWT_SECRET"),
    TOKEN_EXPIRY: getEnvValue("TOKEN_EXPIRY"),
    SALT: getEnvValue("SALT")
  },

  CLOUDINARY: {
    CLOUDINARY_NAME: getEnvValue("CLOUDINARY_NAME"),
    CLOUDINARY_API_KEY: getEnvValue("CLOUDINARY_API_KEY"),
    CLOUDINARY_SECRET: getEnvValue("CLOUDINARY_SECRET")
  },

  LOG: {
    LOG_PLACE: getEnvValue("LOG_PLACE")
  },

  RATELIMIT: {
    RATE_LIMIT: getEnvValue("RATE_LIMIT"),
    RATE_TIMER: getEnvValue("RATE_TIMER")
  },

  MAILER: {
    MAIL_HOST: getEnvValue("MAIL_HOST"),
    MAIL_PORT: getEnvValue("MAIL_PORT"),
    MAIL_USER: getEnvValue("MAIL_USER"),
    MAIL_PASS: getEnvValue("MAIL_PASS")
  }
}