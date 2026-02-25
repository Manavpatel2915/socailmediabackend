import Redis from "ioredis";
import { env } from "../env.config";

const redis = new Redis({
  host: String(env.DB.REDIS_HOST),
  port: Number(env.DB.REDIS_PORT),
  password: env.DB.REDIS_PASSWORD || undefined,
});

redis.on("connect", () => {
  console.log(" Redis connected successfully");
});

redis.on("error", (error) => {
  console.error(" Redis connection error:", error);
});

export default redis;