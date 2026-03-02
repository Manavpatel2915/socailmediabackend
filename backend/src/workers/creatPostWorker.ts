import { Worker } from "bullmq";
import { createPost } from "../services/post-service";
import redis from "../config/databases/redis-connect";

export const createPostWorker = new Worker('createPost', async (job) => {
  const data = job.data;
  const { title, content, image, userId } = data;
  await createPost(title, content, image, userId);
  return { success: true };
}, {
  connection: redis,
  concurrency: 1,
});

createPostWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

createPostWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

