import { Queue } from "bullmq";
import redis from "../config/databases/redis";

export const creatPostQueues = new Queue('creatPost', {
  connection: redis,
});
