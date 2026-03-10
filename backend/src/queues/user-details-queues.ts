import { Queue } from "bullmq";
import redis from "../config/databases/redis-connect";

export const userDetailsQueues = new Queue("userDetails", {
  connection: redis,
});
