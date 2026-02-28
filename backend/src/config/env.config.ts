import "dotenv/config";

export type Env = "development" | "test" | "production";

const PROCESSENV = process.env;

function getEnvVaule(name: string): string {
  const value = PROCESSENV[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}
export const env = {
  NODE_ENV: (PROCESSENV.NODE_ENV as Env) || "development",

  DB: {
    MONGODB_URL: getEnvVaule("MONGODB_URL"),
    DB_NAME: getEnvVaule("DB_NAME"),
    DB_PORT: getEnvVaule("DB_PORT"),
    DB_USER: getEnvVaule("DB_USER"),
    DB_PASSWORD: getEnvVaule("DB_PASSWORD"),
    DB_HOST: getEnvVaule("DB_HOST"),
    PORT: getEnvVaule("PORT"),
    REDIS_HOST: getEnvVaule("REDIS_HOST"),
    REDIS_PORT: getEnvVaule("REDIS_PORT"),
    REDIS_PASSWORD: getEnvVaule("REDIS_PASSWORD"),
  },

  JWT: {
    JWT_SECRET: getEnvVaule("JWT_SECRET"),
    TOKEN_EXPRI: getEnvVaule("TOKEN_EXPRI"),
    SALT: getEnvVaule("SALT")
  },

  CLOUDINARY: {
    CLOUDINARY_NAME: getEnvVaule("CLOUDINARY_NAME"),
    CLOUDINARY_API_KEY: getEnvVaule("CLOUDINARY_API_KEY"),
    CLOUDINARY_SECRET: getEnvVaule("CLOUDINARY_SECRET")
  },

  LOG: {
    LOG_PLACE: getEnvVaule("LOG_PLACE")
  },

  RATELIMIT: {
    REAT_LIMIT: getEnvVaule("REAT_LIMIT"),
    REAT_TIMER: getEnvVaule("REAT_TIMER")
  },

  MAILER: {
    MAIL_HOST: getEnvVaule("MAIL_HOST"),
    MAIL_PORT: getEnvVaule("MAIL_PORT"),
    MAIL_USER: getEnvVaule("MAIL_USER"),
    MAIL_PASS: getEnvVaule("MAIL_PASS")
  }
}