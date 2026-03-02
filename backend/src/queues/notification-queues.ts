import { Queue } from "bullmq";
import redis from "../config/databases/redis-connect";

export const notificationQueues = new Queue('notification', {
  connection: redis,
});
