import { Queue } from "bullmq";
import redis from "../config/databases/redis";

export const notificationQueues = new Queue('notification', {
  connection: redis,
});
