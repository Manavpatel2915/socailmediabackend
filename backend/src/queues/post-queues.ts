import { Queue } from "bullmq";
import redis from "../config/databases/redis-connect";

export const createPostQueues = new Queue('createPost', {
  connection: redis,
});
