import { Queue } from "bullmq";
import redis from "../config/databases/redis";

export const userDetailsQueues = new Queue('userDetails', {
  connection: redis,
});
