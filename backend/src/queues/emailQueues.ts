import { Queue } from "bullmq";
import redis from "../config/databases/redis";

export const emailQueue = new Queue('email', {
  connection: redis,
});

